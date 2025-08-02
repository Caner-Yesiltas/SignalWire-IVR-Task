// Load environment variables from .env file
require('dotenv').config();

// CORRECT WAY: Import the top-level SignalWire object
const { SignalWire } = require('@signalwire/realtime-api');

// Main function to run the application
async function run() {
  try {
    // Connect to SignalWire using credentials from .env
    const client = await SignalWire({
      project: process.env.SIGNALWIRE_PROJECT_ID,
      token: process.env.SIGNALWIRE_AUTH_TOKEN,
      // Note: The new client doesn't need contexts here, it's defined in the listener
      signalwireSpaceUrl: process.env.SIGNALWIRE_SPACE_URL,
    });

    // Listen for incoming calls on a specific topic (context)
    await client.voice.listen({
      topics: ['caner-ivr-task'], 
      onCallReceived: async (call) => {
        console.log(`Call received from: ${call.from}`);

        try {
          await call.answer();
          console.log('Call answered.');

          // Play the initial greeting as requested in the assignment
          await call.playTTS({ text: 'Thanks for calling XYZ..' });
          console.log('Welcome message played.');
        } catch (error) {
          console.error('An error occurred during the call:', error);
        } finally {
          // Always hang up the call
          await call.hangup();
          console.log('Call hung up.');
        }
      },
    });

    console.log('Application is running and waiting for calls...');
  } catch (error) {
    console.error('Failed to start the application:', error);
  }
}

// Start the application
run();
