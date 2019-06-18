const moment = require('moment');
const Twitter = require('twitter');
const schedule = require('node-schedule');
const app = require('../app');

const { key, secret, token, token_secret } = app.get('options');

const client = new Twitter({
  consumer_key: key,
  consumer_secret: secret,
  access_token_key: token,
  access_token_secret: token_secret
});

// filterling timeline via Public API "statuses/filter" with bot's id
client.stream('statuses/filter', { track: '@remindbot_d' }, stream => {
  // obtain filtered data stream and display tweet's text
  stream.on('data', ({ text, user, id_str }) => {
    const idOmittedText = text.replace(/^@remindbot_d\s/g, '');
    const timing = (() => {
      try {
        return idOmittedText.match(/at\s(.*)$/)[1];
      } catch (e) {
        return null;
      }
    })();

    if (idOmittedText.match(/^How\sare\syou\?$/)) {
      // replying post
      client.post(
        'statuses/update',
        {
          status: `@${user.screen_name} I'm fine.`,
          in_reply_to_status_id: id_str
        },
        (error, tweet, response) => {
          if (!error) {
            process.stdout.write('fine resopnse done.\n');
          }
        }
      );

      return;
    }

    if (!timing) {
      // replying post
      client.post(
        'statuses/update',
        {
          status: `@${
            user.screen_name
          } Sorry, I can't understand. Please reply me in a valid format.`,
          in_reply_to_status_id: id_str
        },
        (error, tweet, response) => {
          if (!error) {
            process.stdout.write('failure resopnse done.\n');
          }
        }
      );

      return;
    }

    const content = idOmittedText.replace(/at\s.*$/, '');

    schedule.scheduleJob(moment(timing).toDate(), () => {
      // replying post
      client.post(
        'statuses/update',
        {
          status: `@${user.screen_name} ${content}`,
          in_reply_to_status_id: id_str
        },
        (error, tweet, response) => {
          if (!error) {
            process.stdout.write('finish reminding.\n');
          }
        }
      );
    });

    // replying post
    client.post(
      'statuses/update',
      {
        status: `@${user.screen_name} I will remind you at ${timing}`,
        in_reply_to_status_id: id_str
      },
      (error, tweet, response) => {
        if (!error) {
          process.stdout.write('resopnse done.\n');
        }
      }
    );
  });
});
