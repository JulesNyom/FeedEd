import admin from 'firebase-admin';
import Mailjet from 'node-mailjet';
import dotenv from 'dotenv';
import { processPrograms } from './emailUtils';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

const db = admin.firestore();

const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC,
  apiSecret: process.env.MJ_APIKEY_PRIVATE
});

async function runEmailSender() {
  while (true) {
    try {
      await processPrograms(db, mailjet);
      console.log('Finished processing programs.');
    } catch (error) {
      console.error('Error in processing programs:', error);
    }
    console.log('Waiting for 2 minutes before next run...');
    await new Promise(resolve => setTimeout(resolve, 2 * 60 * 1000)); // Wait for 2 minutes
  }
}

// Start the email sender
runEmailSender().catch(console.error);

console.log('Email sender script is running...');