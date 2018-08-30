module.exports.handler = async message => {
  const body = JSON.parse(message.body.toString());

  if (body.token != process.env.SLACK_VERIFICATION_TOKEN) {
    throw new Error('Invalid Verification Token received from Slack!');
  }

  switch (body.type) {
    case 'url_verification':
      // Respond to the initial verification challenge when first setting
      // up integration with Slack
      return {
        body: body.challenge
      };

    case 'event_callback':
      if (body.event.type !== 'app_mention') {
        throw new Error(`Unrecognized callback type: ${body.event.type}`);

      return handleMention(body.event);

    default:
      throw new Error(`Unrecognized event type: ${body.type}`);
  }
};

const KILL_RE = /kill (([a-zA-Z0-9_]+[,\s]+)*[a-zA-Z0-9_]+)/;
const handleMention = async event => {
  const killMatch = event.text.match(KILL_RE);

  if (killMatch) {
    const serversToKill = killMatch[1].split(/[,\s]+/);

    await db()('servers')
      .whereIn('name', serversToKill)
      .delete();
  } else if (event.text.includes('killall')) {
    await db()('servers')
      .delete();
  }
};

const postMessage = async message => {
  const fetch = require('node-fetch');

  await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    body: JSON.stringify(message),
    headers: {
      Authorization: `Bearer ${process.env.SLACK_BOT_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    }
  });
};

const db = () => require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.DB_ADDRESS,
    port: process.env.DB_PORT,
    user: 'root',
    password: process.env.DB_PASSWORD
  }
});

