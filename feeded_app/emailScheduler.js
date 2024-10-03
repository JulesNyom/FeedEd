const dotenv = require('dotenv');

dotenv.config();

const API_URL = 'http://localhost:3000/api/email';

async function runEmailProcess() {
  try {
    const fetch = (await import('node-fetch')).default;
    console.log(`Sending GET request to ${API_URL}`);
    const response = await fetch(API_URL, { method: 'GET' });
    
    console.log(`Response status: ${response.status}`);
    const contentType = response.headers.get("content-type");
    console.log(`Content-Type: ${contentType}`);

    if (contentType && contentType.indexOf("application/json") !== -1) {
      const data = await response.json();
      console.log('Email process result:', data);
    } else {
      const text = await response.text();
      console.log('Response is not JSON. First 100 characters of response:', text.substring(0, 100));
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    console.error('Error running email process:', error);
  }
}

function startScheduler() {
  console.log('Starting email scheduler...');
  // Run immediately on start
  runEmailProcess();
  
  // Then run every 2 minutes
  setInterval(runEmailProcess, 2 * 60 * 1000);
}

startScheduler();