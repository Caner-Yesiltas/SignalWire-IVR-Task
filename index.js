// Load environment variables from .env file
require('dotenv').config();

const { SignalWire } = require('@signalwire/realtime-api');

const SUPPORT_NUMBER = process.env.SUPPORT_FORWARDING_NUMBER;
const SALES_NUMBER = process.env.SALES_FORWARDING_NUMBER;

// Main function to run the application
async function run() {
  try {
    // Connect to SignalWire using credentials from .env
    const client = await SignalWire({
      project: process.env.SIGNALWIRE_PROJECT_ID,
      token: process.env.SIGNALWIRE_AUTH_TOKEN,
      signalwireSpaceUrl: process.env.SIGNALWIRE_SPACE_URL,
    });

    // Listen for incoming calls on a specific topic (context)
    await client.voice.listen({
      topics: ['caner-ivr-task'],
      onCallReceived: async (call) => {
        console.log(`Call received from: ${call.from}`);

        try {
          await call.answer();
         

          const prompt = await call.promptTTS({
            text: 'Thanks for calling XYZ.. press 1 to talk to support, press 2 to talk to sales, or press 3 to record a voicemail.',
            digits: {
              max: 1,
              digitTimeout: 5,
            },
          });

          const digit = prompt.digits;
          console.log(`User pressed: ${digit}`);

          // Play the initial greeting as requested in the assignment
          if (digit === '1') {
            await call.playTTS({ text: 'Connecting you to support.' });
            await call.connectPhone({ to: SUPPORT_NUMBER });
          } else if (digit === '2') {
            await call.playTTS({ text: 'Connecting you to sales.' });
            await call.connectPhone({ to: SALES_NUMBER });
           } else if (digit === '3') {
            await call.playTTS({ text: 'Please leave your message after the beep. Press any key when you are finished.' });
            
            const recording = await call.record({
              beep: true,
              terminators: '#*0123456789' 
            });
            
            console.log(`Voicemail recorded. URL: ${recording.url}`);

            await call.playTTS({ text: 'Thank you for your message. Goodbye.' });
            await call.hangup();
          } else {
            // For now, any other input gets this message before hanging up.
            await call.playTTS({ text: 'Invalid selection. Goodbye.' });
            await call.hangup();
          }
        } catch (error) {
          console.error('An error occurred during the call:', error);
        } finally {
          // Always hang up the call
          await call.hangup();
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
