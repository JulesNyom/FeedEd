"use client"

import React, { useState } from 'react';
import { auth } from '@/firebase';

const EmailSender = () => {
  const [status, setStatus] = useState('');

  const sendEmail = async () => {
    setStatus('Sending...');
    const user = auth.currentUser;
    if (user) {
      try {
        const response = await fetch('/api/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.uid }),
        });
        const data = await response.json();
        console.log(data);
        setStatus(data.message || 'Email sent successfully');
      } catch (error) {
        console.error('Error sending email:', error);
        setStatus('Failed to send email');
      }
    } else {
      console.error('No user is signed in.');
      setStatus('No user is signed in');
    }
  };

  return (
    <div>
      <button onClick={sendEmail}>Send Test Email</button>
      <p>{status}</p>
    </div>
  );
};

export default EmailSender;