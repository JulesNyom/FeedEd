import { NextResponse } from 'next/server';
import Mailjet from 'node-mailjet';

export async function POST() {
  console.log('MJ_APIKEY_PUBLIC:', process.env.MJ_APIKEY_PUBLIC);
  console.log('MJ_APIKEY_PRIVATE:', process.env.MJ_APIKEY_PRIVATE);

  if (!process.env.MJ_APIKEY_PUBLIC || !process.env.MJ_APIKEY_PRIVATE) {
    console.error('Mailjet API keys are missing');
    return NextResponse.json({ error: 'Mailjet API keys are missing' }, { status: 500 });
  }

  try {
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
              "Email": "julesnyom@gmail.com",
              "Name": "Jules Nyom"
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
    console.error('Mailjet Error:', err);
    return NextResponse.json({ error: 'Failed to send email', details: err.message }, { status: 500 });
  }
}