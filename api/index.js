const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const devPort = 8080;

const app = express();

if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const config = require('../webpack.dev.js');
  const compiler = webpack(config);
  app.use(
    require('webpack-dev-middleware')(compiler, {
      publicPath: '/dist',
    }),
  );
  app.use(require('webpack-hot-middleware')(compiler));
  app.use('/', express.static(require('path').join(__dirname, '..', 'public')));
  app.listen(devPort, () => console.log(`Listening on port ${devPort}`));
}

const getData = (el) => {
  return [
    el.find('.currency .print_show').text().trim(),
    el.find('[data-table="Spot Buying"]').first().text().trim(),
  ];
};

app.get('/api/exchange-rate', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  axios.get('https://rate.bot.com.tw/xrt?Lang=en-US')
    .then((response) => {
      const $ = cheerio.load(response.data);

      const time = $('.time').text().trim();
      const result = {
        time,
        'American Dollar (USD)': '',
        'Australian Dollar (AUD)': '',
        'New Zealand Dollar (NZD)': '',
        'Chinese Yuan (CNY)': '',
      };
      $('.table tbody tr')
        .each((i, el) => {
          const data = getData($(el));
          if (data[0] in result) {
            delete result[data[0]];
            result[data[0].match(/\(([^)]+)\)/)[1]] = +data[1];
          }
        });

      res.json(result);
    });
});

module.exports = app;
