const express = require('express');
const { resolve } = require('path');

const { env } = process;
const {
  TWIBOT_TWITTER_KEY,
  TWIBOT_TWITTER_SECRET,
  TWIBOT_TWITTER_TOKEN,
  TWIBOT_TWITTER_TOKEN_SECRET,
  PORT
} = env;

const app = express();

// 環境変数から Titter アプリケーションのキー等を取得
const options = {
  key: TWIBOT_TWITTER_KEY,
  secret: TWIBOT_TWITTER_SECRET,
  token: TWIBOT_TWITTER_TOKEN,
  token_secret: TWIBOT_TWITTER_TOKEN_SECRET
};
app.set('options', options);

app.set('port', PORT || 5000);
app.use(express.static(resolve(__dirname, '/public')));

app.get('/', (request, response) => {
  response.send('This is Twitter-bot application.');
});

app.listen(app.get('port'), () => {
  process.stdout.write(`Node app is running at localhost:${app.get('port')}\n`);
});

module.exports = app;
