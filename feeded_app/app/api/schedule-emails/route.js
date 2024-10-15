import { NextResponse } from 'next/server';

export async function GET(req) {
  console.log('Email scheduler triggered');

  try {
    // Call the email processing API
    const response = await fetch("http://localhost:3000/api/email", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any necessary authentication headers here
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Email processing result:', result);

    return NextResponse.json({ message: 'Email processing triggered successfully', result });
  } catch (error) {
    console.error('Failed to trigger email processing:', error);
    return NextResponse.json({ error: 'Failed to trigger email processing' }, { status: 500 });
  }
}