import slackbolt from '@slack/bolt';
import { ChatGPTAPIBrowser } from 'chatgpt';

const { App } = slackbolt;

import Config from '../config.js';

const chatGPT = new ChatGPTAPIBrowser({
    email: Config.OPENAI_EMAIL,
    password: Config.OPENAI_PASSWORD
});

console.log('Setting up chatGPT session...');
chatGPT.initSession();
console.log('done');


const app = new App({
    token: Config.SLACK_BOT_TOKEN,
    signingSecret: Config.SLACK_SIGNING_SECRET,
    socketMode: true, // enable the following to use  socket mode
    appToken: Config.APP_TOKEN
});

app.message('$gpt', async ({ message, say }) => {
    try {
        const msg = message.text;
        const prompt = msg.replace('$gpt ', '');
        if (!msg.startsWith('$gpt')) {
            console.log('ignoring message with $gpt but not starts with:')
            console.log(msg);
            return;
        }
        if (prompt.trim() === '') {
            say('Sorry, your prompt must have something in it.');
            return
        }
        const result = await chatGPT.sendMessage(prompt);
        await say(result.response);
    } catch (error) {
        console.log('err');
        console.error(error);
    }
});

app.event('app_mention', ({event, client, logger}) => {
    client.chat.sendMessage("Hi! Please send a prompt to me using the format '$gpt [prompt] and I will see what I can do for you");
});

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
    // Start the app
    await app.start(process.env.PORT || 3000);
  
    console.log('⚡️ Bolt app is running!');
})();
