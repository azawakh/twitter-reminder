const moment = require('moment');
const Twit = require('twit');
const { CronJob } = require('cron');
const app = require('../app');

const { key, secret, token, token_secret } = app.get('options');

const T = new Twit({
  consumer_key: key,
  consumer_secret: secret,
  access_token: token,
  access_token_secret: token_secret
});

const cronTime = '0 * * * * *'; // s m h d m w

(() =>
  new CronJob({
    cronTime,
    onTick() {
      const message = moment()
        .utc()
        .add(9, 'h')
        .format('ただいま MM月DD日 HH時mm分です。');
      process.stdout.write(`${message}\n`);

      T.post('statuses/update', { status: message }, (err, data, response) => {
        // console.log('Tweet!');
      });
    },
    start: true
  }))();
