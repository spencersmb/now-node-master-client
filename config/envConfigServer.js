const prod = process.env.NODE_ENV === 'production'
const config = require('./config.json')

/*
This is a seperate config file that runs in node.
Ideally I need to create one config file that runs in both client and the serverside
*/
exports.envConfig = {
  BACKEND_URL: prod ? config.PROD_URL : config.DEV_URL,
  REFRESH_WINDOW: config.REFRESH_WINDOW,
  WEBSITE_TITLE: 'Now Thats Delicious!',
  TAGS: ['Wifi', 'Open Late', 'Family Friendly', 'Vegetarian', 'Licensed']
}
