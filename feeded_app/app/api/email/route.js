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
          "From": { "Email": userEmail, "Name": userName },
          "To": [{ "Email": studentEmail, "Name": studentName }],
          "Subject": subject,
          "TextPart": textContent,
          "HTMLPart": htmlContent
        }
      ]
    });
}

export async function GET(request) {
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

    if (studentData[`${type}EmailSent`]) {
      console.log(`${type} email already sent to student ${studentId}`);
      return NextResponse.json({ message: 'Email already sent' }, { status: 200 });
    }

    console.log('Preparing to send email via Mailjet');
    const mailjet = new Mailjet({
      apiKey: process.env.MJ_APIKEY_PUBLIC,
      apiSecret: process.env.MJ_APIKEY_PRIVATE
    });

    const surveyLink = `http://localhost:3000/${type}/${programId}-${studentId}`;
    const updatedTextContent = textContent.replace('${surveyLink}', surveyLink);
    const updatedHtmlContent = htmlContent.replace('${surveyLink}', surveyLink);

    const result = await sendEmail(mailjet, userEmail, userName, studentEmail, studentName, subject, updatedTextContent, updatedHtmlContent);

    console.log('Email sent successfully');

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

        // Hot email logic
        if (program.status === "Terminé" && daysSinceEnd >= 1 && !student.hotEmailSent) {
          const subject = "Merci pour votre participation et enquête de satisfaction";
          const surveyLink = `http://localhost:3000/chaud/${program.id}-${student.id}`;
          const textContent = `Cher(e) ${studentName},\n\nMerci d'avoir participé à notre programme de formation "${program.name}". Nous espérons que vous avez trouvé cette expérience enrichissante.\n\nNous vous serions reconnaissants de bien vouloir prendre quelques minutes pour répondre à notre enquête de satisfaction : ${surveyLink}\n\nVotre feedback est précieux pour nous aider à améliorer nos formations.\n\nCordialement,\nL'équipe de formation`;
          const htmlContent = `<p>Cher(e) ${studentName},</p><p>Merci d'avoir participé à notre programme de formation "${program.name}". Nous espérons que vous avez trouvé cette expérience enrichissante.</p><p>Nous vous serions reconnaissants de bien vouloir prendre quelques minutes pour répondre à notre <a href="${surveyLink}">enquête de satisfaction</a>.</p><p>Votre feedback est précieux pour nous aider à améliorer nos formations.</p><p>Cordialement,<br>L'équipe de formation</p>`;

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

        // Cold email logic
        const programDuration = Math.floor((endDate.getTime() - new Date(program.startDate).getTime()) / (1000 * 60 * 60 * 24));
        if (programDuration > 60 && daysSinceEnd >= 90 && !student.coldEmailSent) {
          const subject = "Suivi de votre formation et enquête d'impact";
          const surveyLink = `http://localhost:3000/froid/${program.id}-${student.id}`;
          const textContent = `Cher(e) ${studentName},\n\n90 jours se sont écoulés depuis la fin de votre formation "${program.name}". Nous espérons que les compétences acquises vous sont utiles dans votre travail quotidien.\n\nNous aimerions connaître l'impact à long terme de cette formation sur votre travail. Merci de prendre quelques minutes pour répondre à notre enquête : ${surveyLink}\n\nVotre retour d'expérience est très important pour nous.\n\nCordialement,\nL'équipe de formation`;
          const htmlContent = `<p>Cher(e) ${studentName},</p><p>90 jours se sont écoulés depuis la fin de votre formation "${program.name}". Nous espérons que les compétences acquises vous sont utiles dans votre travail quotidien.</p><p>Nous aimerions connaître l'impact à long terme de cette formation sur votre travail. Merci de prendre quelques minutes pour répondre à notre <a href="${surveyLink}">enquête d'impact</a>.</p><p>Votre retour d'expérience est très important pour nous.</p><p>Cordialement,<br>L'équipe de formation</p>`;

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