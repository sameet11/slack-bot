const { App } = require('@slack/bolt');
const fs = require('fs');
require('dotenv').config();
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true, 
    appToken: process.env.SLACK_APP_TOKEN,
    port: process.env.PORT || 3000
  });
  app.message(async ({ message, say }) => {
    if (message.text.toLowerCase().includes('hello')) {
    await say(`Hey there <@${message.user}>!`);
    }
  });

  app.message( async ({ message, say }) => {

    if (message.text.toLowerCase().includes('bye')) {
    await say(`Good-bye 👋 <@${message.user}>`)
    }
  });

  app.message(async ({ message, say }) => {
    if (message.text.toLowerCase().includes('game')) {
    await say({
      blocks: [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `Lets play <@${message.user}>!`
          },
          "accessory": {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Click Me"
            },
            "action_id": "button_click"
          }
        }
      ],
      text: ` Better Luck Next Time <@${message.user}>!`
    });
  }
  });
  app.action('button_click', async ({ body, ack, say }) => {
    
    await ack();
    var randomNumberInRange = Math.random() * 10;
    if(randomNumberInRange>5){
      await say(`<@${body.user.id}> You Won!!`);
    }
    else{
      await say(`<@${body.user.id}> You Lose ;)`);
    }
  });
 
  app.event('file_shared', async ({ event, client }) => {
    
    try {
      const fileInfo = await client.files.info({
        file: event.file_id,
      });
  
      const file = await client.files.download({
        file: event.file_id,
      });
  
      const filePath = `./downloads/${fileInfo.file.name}`;
      fs.writeFileSync(filePath, file);
  
      console.log(`File downloaded: ${filePath}`);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  });
  (async () => {
    // Start your app
    await app.start();
  
    console.log('⚡️ Bolt app is running!');
  })();