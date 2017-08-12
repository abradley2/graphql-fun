const m = require('mithril')

function navItem({icon, label, href}) {
	return m('a.dt.ph2.ph3-l.h-100.white.link', {href}, [
		m('div.dtc.v-mid.tc.ph1', [
			m(`i.f3.fa.fa-${icon}`),
			m('div.db.dn-l.f6', label)
		]),
		m('div.dn.dtc-l.v-mid.ph1.f3', [
			label
		])
	])
}

function navbar() {
	return m('div.flex.justify-between.fixed.top-0.left-0.right-0.h3.bg-black-90.white-90', [
		m('div.flex', [
			navItem({icon: 'home', label: 'home', href: '#!/'})
		]),
		m('div.flex', [
			navItem({icon: 'user', label: 'Login or Register', href: '#!/'}),
			navItem({icon: 'cloud', label: 'User', href: '#!/'})
		])
	])
}

module.exports = {view: navbar}
