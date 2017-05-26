import { svgs } from './svgs'
const prod = process.env.NODE_ENV === 'production'
/*
https://testone.now.sh/api = myapi.nw.sh/api
because of this translation - the routes on the API need to be looking for /api/__route__
Since Now does it this way - in order to have our app ready for Prod deployment, adding api on the end of
localHost:3000/api -> translates to http://localhost:7777 due to http-proxy - so now our original /api/__route__
will still work in both Dev and Production
*/
export default {
  BACKEND_URL: prod
    ? 'https://testone.now.sh/api'
    : 'http://localhost:3000/api',
  WEBSITE_TITLE: 'Now Thats Delicious!',
  LINKS: [
    { slug: '/stores', title: 'Stores', icon: svgs.Store },
    { slug: '/tags', title: 'Tags', icon: svgs.Tag },
    { slug: '/other', title: 'Moment', icon: svgs.Top },
    { slug: '/create', title: 'Add', icon: svgs.Add, authRequired: true }
    // { slug: '/map', title: 'Map', icon: svgs.MapSvg }
  ],
  LOGO: svgs.Logo,
  TAGS: ['Wifi', 'Open Late', 'Family Friendly', 'Vegetarian', 'Licensed']
}
