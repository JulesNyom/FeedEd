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
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
  }
}

const db = getFirestore();

export async function POST(req) {
  console.log('Received request to send email');

  if (!db) {
    console.error('Firebase not initialized');
    return NextResponse.json({ error: 'Internal server error: Firebase not initialized' }, { status: 500 });
  }

  if (!process.env.MJ_APIKEY_PUBLIC || !process.env.MJ_APIKEY_PRIVATE) {
    console.error('Mailjet API keys are missing');
    return NextResponse.json({ error: 'Internal server error: Mailjet API keys missing' }, { status: 500 });
  }

  try {
    const { userId, subject, textContent, htmlContent, programId, studentId, type } = await req.json();
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
    const userEmail = userData.email;
    const userName = userData.displayName || 'User';

    // Fetch student data from Firestore
    const studentDoc = await db.doc(`users/${userId}/programs/${programId}/students/${studentId}`).get();
    if (!studentDoc.exists) {
      console.error('Student not found');
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    const studentData = studentDoc.data();
    const studentEmail = studentData.email;

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

    const result = await mailjet
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
                "Name": `${studentData.firstName} ${studentData.lastName}`
              }
            ],
            "Subject": subject,
            "TextPart": textContent,
            "HTMLPart": htmlContent
          }
        ]
      });

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