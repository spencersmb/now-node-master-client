const { svgs } = require('../../config/svgs')

exports.nav = {
  LOGO: svgs.Logo,
  LINKS: [
    { slug: '/stores', title: 'Stores', icon: svgs.Store },
    { slug: '/tags', title: 'Tags', icon: svgs.Tag },
    { slug: '/top', title: 'Top', icon: svgs.Top, authRequired: true },
    { slug: '/other', title: 'Moment', icon: svgs.MapSvg },
    { slug: '/create', title: 'Add', icon: svgs.Add, authRequired: true }
  ]
}
