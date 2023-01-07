# slackGPT
a slack bot for chatGPT

Uses the chatgpt npm package driven by puppeteer. I had to hack the node_modules in order to get it to think it was properly authorised, so im committing that too.


To get a bot that actually works:
* enable socket mode for bot
* enable even subscriptions for bot
* subscribe to message.channels for bot in events api
* chat:write needed in bot scopes
* not sure what else.


requires bot chat tokens, signing secret, oauth token