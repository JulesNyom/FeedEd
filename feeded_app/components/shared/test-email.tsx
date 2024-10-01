"use client"

import React, { useState } from 'react';

const EmailSender = () => {
  const [status, setStatus] = useState('');

  const sendEmail = async () => {
    setStatus('Sending...');
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok) {
        setStatus('Email sent successfully!');
      } else {
        setStatus(`Failed to send email: ${data.error}`);
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
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