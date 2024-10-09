// Import the dotenv package to load environment variables from a .env file
const dotenv = require('dotenv');

// Load environment variables from .env file into process.env
dotenv.config();

// Define the API URL for the email service
const API_URL = 'http://localhost:3000/api/email';

// Function to run the email process
async function runEmailProcess() {
  try {
    // Dynamically import node-fetch (this allows for use in environments where fetch isn't globally available)
    const fetch = (await import('node-fetch')).default;
    
    console.log(`Sending GET request to ${API_URL}`);
    // Send a GET request to the API
    const response = await fetch(API_URL, { method: 'GET' });
    
    console.log(`Response status: ${response.status}`);
    // Get the content type of the response
    const contentType = response.headers.get("content-type");
    console.log(`Content-Type: ${contentType}`);

    // Check if the response is JSON
    if (contentType && contentType.indexOf("application/json") !== -1) {
      // If it's JSON, parse and log the response data
      const data = await response.json();
      console.log('Email process result:', data);
    } else {
      // If it's not JSON, log the first 100 characters of the response
      const text = await response.text();
      console.log('Response is not JSON. First 100 characters of response:', text.substring(0, 100));
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    // Log any errors that occur during the process
    console.error('Error running email process:', error);
  }
}

// Function to start the email scheduler
function startScheduler() {
  console.log('Starting email scheduler...');
  // Run the email process immediately when the scheduler starts
  runEmailProcess();
  
  // Then run the email process every 2 minutes (120,000 milliseconds)
  setInterval(runEmailProcess, 2 * 60 * 1000);
}

// Start the scheduler when this script is run
startScheduler();