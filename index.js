/* eslint-disable import/extensions */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import slackbolt from '@slack/bolt';
import { ChatGPTAPIBrowser } from 'chatgpt';

import Config from './config.js';

const { App } = slackbolt;

const chatGPT = new ChatGPTAPIBrowser({
  email: Config.OPENAI_EMAIL,
  password: Config.OPENAI_PASSWORD,
  debug: true,
});

console.log('Setting up chatGPT session...');
await chatGPT.initSession();
console.log('done');

const app = new App({
  token: Config.SLACK_BOT_TOKEN,
  signingSecret: Config.SLACK_SIGNING_SECRET,
  socketMode: true, // enable the following to use  socket mode
  appToken: Config.APP_TOKEN,
});

let lastResponse;
let busy = false;
const startTime = Date.now();

app.message('$gpt', async ({ message, say }) => {
  try {
    if (Date.now() > (startTime + 3600 * 1000)) {
      await say('Sorry, session expired, please log in again');
      return;
    }
    if (busy) {
      await say(`Sorry, im busy with '${busy}'`);
      return;
    }
    const { text } = message;
    const prompt = text.replace('$gpt ', '').trim();
    busy = prompt;
    if (!text.startsWith('$gpt')) {
      console.log('ignoring message with $gpt but not starts with:');
      console.log(text);
      return;
    }
    if (prompt === '') {
      await say('Sorry, your prompt must have something in it.').catch((error) => { throw new Error(error); });
      return;
    }
    console.log(`getting response for ${prompt}`);
    await say(`OK! Getting response for '${prompt}'`);
    lastResponse = await chatGPT.sendMessage(prompt, lastResponse ? { conversationId: lastResponse.conversationId, parentMessageId: lastResponse.messageId } : undefined)
      .catch((error) => { throw new Error(error); });
    await say(lastResponse.response).catch((error) => { throw new Error(error); });
    busy = false;
  } catch (error) {
    busy = false;
    console.error(error?.message ?? error);
    await say(`An error occurred: ${error?.message ?? error}`).catch(() => {
      console.error(`failed to post error to chat: ${error}`);
    });
  }
});

app.event('app_mention', ({ client }) => {
  client.chat.sendMessage("Hi! Please send a prompt to me using the format '$gpt [prompt] and I will see what I can do for you");
});

await app.start(process.env.PORT || 3000);

console.log('⚡️ Bolt app is running!');
