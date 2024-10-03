import { NextResponse } from 'next/server';
import Mailjet from 'node-mailjet';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
      }),
    });
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
  }
}

const db = getFirestore();

async function sendEmail(mailjet, userEmail, userName, studentEmail, studentName, subject, textContent, htmlContent) {
  return mailjet
    .post("send", {'version': 'v3.1'})
    .request({
      "Messages":[
        {
          "From": {
            "Email": userEmail,
            "Name": userName
          },
          "To": [
            {
              "Email": studentEmail,
              "Name": studentName
            }
          ],
          "Subject": subject,
          "TextPart": textContent,
          "HTMLPart": htmlContent
        }
      ]
    });
}

async function processPrograms(db, mailjet) {
  console.log('Starting to process programs...');
  const usersSnapshot = await db.collection('users').get();

  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    const userData = userDoc.data();
    const userEmail = userData.email;
    const userName = userData.displayName || 'User';

    const programsSnapshot = await db.collection(`users/${userId}/programs`).get();

    for (const programDoc of programsSnapshot.docs) {
      const program = { id: programDoc.id, ...programDoc.data() };
      const currentDate = new Date();
      const endDate = new Date(program.endDate);
      const daysSinceEnd = Math.floor((currentDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));

      const studentsSnapshot = await db.collection(`users/${userId}/programs/${program.id}/students`).get();

      for (const studentDoc of studentsSnapshot.docs) {
        const student = { id: studentDoc.id, ...studentDoc.data() };
        const studentName = `${student.firstName} ${student.lastName}`;

        if (program.status === "Terminé" && daysSinceEnd >= 1 && !student.hotEmailSent) {
          const subject = "Merci pour votre participation";
          const textContent = `Cher(e) ${studentName},\n\nMerci d'avoir participé à notre programme de formation "${program.name}". Nous espérons que vous avez trouvé cette expérience enrichissante.\n\nCordialement,\nL'équipe de formation`;
          const htmlContent = `<p>Cher(e) ${studentName},</p><p>Merci d'avoir participé à notre programme de formation "${program.name}". Nous espérons que vous avez trouvé cette expérience enrichissante.</p><p>Cordialement,<br>L'équipe de formation</p>`;

          try {
            await sendEmail(mailjet, userEmail, userName, student.email, studentName, subject, textContent, htmlContent);
            await db.doc(`users/${userId}/programs/${program.id}/students/${student.id}`).update({
              hotEmailSent: true,
              hotEmailSentDate: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`Hot email sent successfully to student ${student.id} for program ${program.id}`);
          } catch (error) {
            console.error(`Failed to send hot email to student ${student.id} for program ${program.id}:`, error);
          }
        }

        const programDuration = Math.floor((endDate.getTime() - new Date(program.startDate).getTime()) / (1000 * 60 * 60 * 24));
        if (programDuration > 60 && daysSinceEnd >= 90 && !student.coldEmailSent) {
          const subject = "Suivi de votre formation";
          const textContent = `Cher(e) ${studentName},\n\n90 jours se sont écoulés depuis la fin de votre formation "${program.name}". Nous espérons que les compétences acquises vous sont utiles dans votre travail quotidien.\n\nCordialement,\nL'équipe de formation`;
          const htmlContent = `<p>Cher(e) ${studentName},</p><p>90 jours se sont écoulés depuis la fin de votre formation "${program.name}". Nous espérons que les compétences acquises vous sont utiles dans votre travail quotidien.</p><p>Cordialement,<br>L'équipe de formation</p>`;

          try {
            await sendEmail(mailjet, userEmail, userName, student.email, studentName, subject, textContent, htmlContent);
            await db.doc(`users/${userId}/programs/${program.id}/students/${student.id}`).update({
              coldEmailSent: true,
              coldEmailSentDate: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`Cold email sent successfully to student ${student.id} for program ${program.id}`);
          } catch (error) {
            console.error(`Failed to send cold email to student ${student.id} for program ${program.id}:`, error);
          }
        }
      }
    }
  }
  console.log('Finished processing programs.');
}

export async function GET() {
  console.log('Received GET request to process programs and send emails');

  if (!db) {
    console.error('Firebase not initialized');
    return NextResponse.json({ error: 'Internal server error: Firebase not initialized' }, { status: 500 });
  }

  if (!process.env.MJ_APIKEY_PUBLIC || !process.env.MJ_APIKEY_PRIVATE) {
    console.error('Mailjet API keys are missing');
    return NextResponse.json({ error: 'Internal server error: Mailjet API keys missing' }, { status: 500 });
  }

  const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_APIKEY_PRIVATE
  });

  try {
    await processPrograms(db, mailjet);
    return NextResponse.json({ message: 'Programs processed and emails sent successfully' });
  } catch (err) {
    console.error('Error in program processing and email sending:', err);
    return NextResponse.json({ error: 'Failed to process programs and send emails: ' + err.message }, { status: 500 });
  }
}

export async function POST(request) {
  console.log('Received POST request to send email');

  if (!db) {
    console.error('Firebase not initialized');
    return NextResponse.json({ error: 'Internal server error: Firebase not initialized' }, { status: 500 });
  }

  if (!process.env.MJ_APIKEY_PUBLIC || !process.env.MJ_APIKEY_PRIVATE) {
    console.error('Mailjet API keys are missing');
    return NextResponse.json({ error: 'Internal server error: Mailjet API keys missing' }, { status: 500 });
  }

  try {
    const { userId, subject, textContent, htmlContent, programId, studentId, type } = await request.json();
    console.log('Received data:', { userId, subject, programId, studentId, type });

    if (!userId || !subject || (!textContent && !htmlContent) || !programId || !studentId || !type) {
      console.error('Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch user data from Firestore
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      console.error('User data not found');
      return NextResponse.json({ error: 'User data not found' }, { status: 404 });
    }

    const userData = userDoc.data();
    if (!userData) {
      console.error('User data is undefined');
      return NextResponse.json({ error: 'User data is undefined' }, { status: 500 });
    }
    const userEmail = userData.email;
    const userName = userData.displayName || 'User';

    // Fetch student data from Firestore
    const studentDoc = await db.doc(`users/${userId}/programs/${programId}/students/${studentId}`).get();
    if (!studentDoc.exists) {
      console.error('Student not found');
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    const studentData = studentDoc.data();
    if (!studentData) {
      console.error('Student data is undefined');
      return NextResponse.json({ error: 'Student data is undefined' }, { status: 500 });
    }
    const studentEmail = studentData.email;
    const studentName = `${studentData.firstName} ${studentData.lastName}`;

    // Check if email has already been sent
    if (studentData[`${type}EmailSent`]) {
      console.log(`${type} email already sent to student ${studentId}`);
      return NextResponse.json({ message: 'Email already sent' }, { status: 200 });
    }

    console.log('Preparing to send email via Mailjet');
    const mailjet = new Mailjet({
      apiKey: process.env.MJ_APIKEY_PUBLIC,
      apiSecret: process.env.MJ_APIKEY_PRIVATE
    });

    const result = await sendEmail(mailjet, userEmail, userName, studentEmail, studentName, subject, textContent, htmlContent);

    console.log('Email sent successfully');

    // Update student document to mark email as sent
    await db.doc(`users/${userId}/programs/${programId}/students/${studentId}`).update({
      [`${type}EmailSent`]: true,
      [`${type}EmailSentDate`]: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`${type} email sent successfully to student ${studentId}`);
    return NextResponse.json({ message: 'Email sent successfully', result: result.body });
  } catch (err) {
    console.error('Error in email sending process:', err);
    return NextResponse.json({ error: 'Failed to send email: ' + err.message }, { status: 500 });
  }
}