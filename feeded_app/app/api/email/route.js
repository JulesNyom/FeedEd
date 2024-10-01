import { NextResponse } from 'next/server';
import Mailjet from 'node-mailjet';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

let db;

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  }
  
  db = getFirestore();
} catch (error) {
  console.error('Failed to initialize Firebase Admin:', error);
}

export async function POST(req) {
  if (!db) {
    console.error('Firebase not initialized');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

  if (!process.env.MJ_APIKEY_PUBLIC || !process.env.MJ_APIKEY_PRIVATE) {
    console.error('Mailjet API keys are missing');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Fetch user data from Firestore
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User data not found' }, { status: 404 });
    }

    const userData = userDoc.data();
    const userEmail = userData.email;
    const userName = userData.displayName || 'User';

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
                "Email": "julesnyom@gmail.com",
                "Name": "Jules Nyom"
              }
            ],
            "Subject": "Test Email from Next.js App Router",
            "TextPart": "This is a test email sent from a Next.js App Router",
            "HTMLPart": "<h3>This is a test email sent from a Next.js App Router</h3>"
          }
        ]
      });

    return NextResponse.json({ message: 'Email sent successfully', result: result.body });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}