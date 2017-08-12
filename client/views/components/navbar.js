const m = require('mithril')

function navItem({icon, label, href}) {
	return m('a.dt.ph2.ph3-l.h-100.white.link', {href}, [
		m('div.dtc.v-mid.tc.ph1', [
			m('div.flex.justify-center.items-center.bg-white-50.h-100.w2', [
				m(`i.f3.fa.fa-${icon}`)
			])
		]),
		label ? m('div.dn.dtc-l.v-mid.ph1.f5', [
			label
		]) : null
	])
}

function navbar() {
	return m('div.shadow-1.flex.justify-between.fixed.top-0.left-0.right-0.h3.bg-black-90.white-90', [
		m('div.flex', [
			navItem({icon: 'bars', href: '#!/'}),
			navItem({icon: 'home', label: 'Home', href: '#!/'})
		]),
		m('div.flex', [
			navItem({icon: 'search', label: 'Find event', href: '#!/'}),
			navItem({icon: 'sign-in', label: 'Login', href: '#!/login'})
		])
	])
}

module.exports = {view: navbar}
