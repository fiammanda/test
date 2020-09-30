
let now = new Date(),
    schemeStore = localStorage.getItem('scheme'),
    schemeMatch = window.matchMedia('(prefers-color-scheme: dark)');

if (!sessionStorage.getItem('visited')) {
	$('html').addClass('load');
	sessionStorage.setItem('visited', 'true');
}

if (schemeStore) {
	$('html').attr('data-scheme', schemeStore);
} else if (schemeMatch.matches || now.getHours() < 8 || now.getHours() > 20) {
	$('html').attr('data-scheme', 'dark');
}

schemeMatch.addListener(function(e) {
	if (!schemeStore) {
		e.matches ? $('html').attr('data-scheme', 'dark') : $('html').attr('data-scheme', 'light');
	}
});

$(window).on('pageshow', function() {
	setTimeout(function() {
		$('html, body, body > a[data-expand]').removeAttr('class');
	}, 10);
});

$(function() {

	const cursor = $('<div data-present="cursor" />').appendTo('body');
	//$('body').wrapInner('<div />').append(cursor);
	$(window).on('mousemove', function(e) {
		cursor.css({
			top: e.clientY - 8,
			left: e.clientX - 8
		});
	}).on('mouseleave', function() {
		cursor.addClass('hidden');
	}).on('mouseenter', function() {
		cursor.removeClass('hidden');
	}).on('mousedown', function() {
		cursor.addClass('active');
	}).on('mouseup', function() {
		cursor.removeClass('active');
	});
	$('a, .footnotes + .footnotes li[role]').on('mouseenter', function() {
		cursor.addClass('hover');
	}).on('mouseleave', function() {
		cursor.removeClass('hover');
	});/*
	$('header[role]').on('mouseenter', function() {
		cursor.css('z-index', '1');
	}).on('mouseleave', function() {
		cursor.css('z-index', 'auto');
	});*/

	let expandA = $('a[data-expand]'),
	    expandH = $('header[role]')[0],
	    expandN = $('main article nav')[0];

	$('a.internal').on('click', function(e) {
		e.preventDefault();
		let href = this.href;
		$('body').removeAttr('data-expand').addClass('load');
		setTimeout(function() {
			document.location.href = href;
		}, 250);
	});
	$('a[rel="home"], [data-location="home"] a.internal').on('click', function() {
		expandA.addClass('load');
	});
	expandA.on('click', function() {
		let menu = this;
		let name = menu.dataset.expand;
		let node = name == 'header' ? expandH : expandN;
		$('body').attr('data-expand', name).on('click', function(e) {
			if (menu !== e.target && !menu.contains(e.target) && node !== e.target && !node.contains(e.target)) {
				$('body').removeAttr('data-expand').off('click');
			}
		});
	});

	$('header[role] .scheme').on('click', function() {
		if (!schemeStore) {
			if ($('html').attr('data-scheme') == 'dark') {
				$('html').attr('data-scheme', 'light');
				localStorage.setItem('scheme', 'light');
			} else {
				$('html').attr('data-scheme', 'dark');
				localStorage.setItem('scheme', 'dark');
			}
		} else if (schemeStore == 'dark') {
			$('html').attr('data-scheme', 'light');
			if (schemeMatch.matches) {
				schemeStore = 'light';
				localStorage.setItem('scheme', 'light');
			} else {
				schemeStore = false;
				localStorage.removeItem('scheme');
			}
		} else if (schemeStore == 'light') {
			$('html').attr('data-scheme', 'dark');
			if (schemeMatch.matches) {
				schemeStore = false;
				localStorage.removeItem('scheme');
			} else {
				schemeStore = 'dark';
				localStorage.setItem('scheme', 'dark');
			}
		}
	});

	if ($('body').attr('data-location') == 'weblog-page') {
		if ($('article nav').length) {
			let posts = $('article ul li');
			$('article nav a').on('click', function() {
				if ($(this).hasClass('current')) {
					$(this).removeAttr('class');
					posts.removeAttr('style');
				} else {
					$(this).addClass('current').siblings().removeAttr('class');
					posts.filter('.' + $(this).text()).removeAttr('style');
					posts.not('.' + $(this).text()).css('max-height', 0);
				}
			});
		}
	}

	if ($('body').attr('data-location') == 'works') {
		if ($('article nav').length) {
			let timeout = true, 
			    headings = $('article section h2'),
			    bar = $('article nav [data-present="bar"]');
			tocHighlight(headings, bar);
			$('article nav a').on('click', function() {
				let target = $(headings[$(this).index()]).offset().top;
				$('html, body').animate({ scrollTop: target - 50 }, Math.abs(window.scrollY - target)/50);
			});
			$(window).on('scroll', function() {
				if (!timeout) {
					return;
				}
				timeout = false;
				setTimeout(function() {
					tocHighlight(headings, bar);
					timeout = true;
				}, 100);
			});
		}
		if ($('.footnotes').length) {
			$('.footnotes').clone().removeAttr('role').insertAfter('.footnotes').find('li[id]').removeAttr('id');
			$('.footnote').on('click', function(e) {
				e.preventDefault();
				$(this).toggleClass('current');
				$('.footnotes + .footnotes li[role]:nth-child(' + $(this).text() + ')').toggleClass('current').siblings().removeClass('current');
			});
			$('.footnotes + .footnotes li[role]').on('click', function() {
				$(this).removeClass('current');
			});
		}
	}
});

function tocHighlight(headings, bar) {
	if (headings[0].getBoundingClientRect().top >= $(window).height()/1.5) {
		bar.removeAttr('class style');
	} else if ($('[data-present="end"]')[0].getBoundingClientRect().bottom <= 200) {
		bar.css('top', headings.length * 1.75 + 'rem').removeAttr('class');
	} else {
		let i = headings.get().reverse().findIndex(function(heading) {
			return heading.getBoundingClientRect().top < $(window).height()/2;
		});
		i = i < 0 ? 0 : headings.length - i - 1;
		bar.css('top', i * 1.75 + 'rem').addClass('current');
	}
}
