/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'scramble\'">' + entity + '</span>' + html;
	}
	var icons = {
		'scramble-logo': '&#xe900;',
		'scramble-dot': '&#xe901;',
		'scramble-plus': '&#xe902;',
		'scramble-cross': '&#xe903;',
		'scramble-smile': '&#xe904;',
		'scramble-shield': '&#xe905;',
		'scramble-notebook': '&#xe906;',
		'scramble-graph': '&#xe908;',
		'scramble-feather': '&#xe90a;',
		'scramble-wallet': '&#xe90b;',
		'scramble-money': '&#xe907;',
		'scramble-coins': '&#xe909;',
		'scramble-arrow-up': '&#xe90c;',
		'scramble-arrow-down': '&#xe90d;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/scramble-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
