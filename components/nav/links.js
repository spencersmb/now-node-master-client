const { svgs } = require('../../config/svgs')

exports.nav = {
  LOGO: svgs.Logo,
  LINKS: [
    { slug: '/stores', title: 'Stores', icon: svgs.Store },
    { slug: '/tags', title: 'Tags', icon: svgs.Tag },
    { slug: '/other', title: 'Moment', icon: svgs.Top },
    { slug: '/create', title: 'Add', icon: svgs.Add, authRequired: true }
    // { slug: '/map', title: 'Map', icon: svgs.MapSvg }
  ]
}
