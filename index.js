require('dotenv').config();
const { SignalWire } = require('@signalwire/realtime-api');

const SUPPORT_NUMBER = process.env.SUPPORT_FORWARDING_NUMBER;
const SALES_NUMBER = process.env.SALES_FORWARDING_NUMBER;

async function run() {
  try {
    const client = await SignalWire({
      project: process.env.SIGNALWIRE_PROJECT_ID,
      token: process.env.SIGNALWIRE_AUTH_TOKEN,
      signalwireSpaceUrl: process.env.SIGNALWIRE_SPACE_URL,
    });

    await client.voice.listen({
      topics: ['caner-ivr-task'],
      onCallReceived: async (call) => {
        console.log(`Call received from: ${call.from}`);

        try {
          const prompt = await Promise.race([
            call.promptTTS({
              text: 'Thanks for calling XYZ.. press 1 to talk to support, press 2 to talk to sales, or press 3 to record a voicemail.',
              digits: { max: 1 },
            }),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('timeout')), 13000),
            ),
          ]);

          const digit = prompt.digits;
          console.log(`User pressed: ${digit}`);

          if (digit === '1') {
            await call.playTTS({ text: 'Connecting you to support.' });
            await call.connectPhone({ to: SUPPORT_NUMBER });
          } else if (digit === '2') {
            await call.playTTS({ text: 'Connecting you to sales.' });
            await call.connectPhone({ to: SALES_NUMBER });
          } else if (digit === '3') {
            await call.playTTS({
              text: 'Please leave your message after the beep. Press any key when you are finished.',
            });

            const recording = await call.record({
              beep: true,
              terminators: '#*0123456789',
               maxSilence: 3, 
                maxLength: 120, 
            });

            console.log(`Voicemail recorded. URL: ${recording.url}`);
            await call.playTTS({
              text: 'Thank you for your message. Goodbye.',
            });
            await call.hangup();
          } else {
            await call.playTTS({ text: 'Invalid selection. Goodbye.' });
            await call.hangup();
          }
        } catch (error) {
          console.error('Call error:', error);

          const message =
            error.message === 'timeout'
              ? 'No input received. Goodbye.'
              : 'Sorry, something went wrong. Goodbye.';

          try {
            await call.playTTS({ text: message });
            await call.hangup();
          } catch (hangupError) {
            console.error('Hangup error:', hangupError);
          }
        }
      },
    });

    console.log('Application is running and waiting for calls...');
  } catch (error) {
    console.error('Failed to start the application:', error);
  }
}

run();
