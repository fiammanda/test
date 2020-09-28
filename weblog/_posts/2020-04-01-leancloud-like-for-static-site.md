---
title: 基于 LeanCloud 的静态页面点击 / 点赞统计
tags: [JavaScript]
---

依次为 `JavaScript` 和 `CSS` 代码。 <!-- more -->

``` javascript
AV.init({
	appId: '',
	appKey: ''
});

let query = new AV.Query('Counter'),
	Log = AV.Object.extend('Counter'),
	url = window.location.pathname,
	title = document.title,
	logId, logView = 1, logLike = 0,
	site = AV.Object.createWithoutData('Counter', '/*objectID for site*/');

if (!localStorage.getItem('/')) {
	site.increment('uv', 1).save().then(function() {
		localStorage.setItem('/', '1');
	});
	if (!sessionStorage.getItem('/')) {
		site.increment('ov', 1).save().then(function() {
			sessionStorage.setItem('/', '1');
		});
	}
}

query.equalTo('url', url).first().then(function(log) {
	if (!log) {
		let log = new Log();
		log.set({
			'url': url, 'title': title,
			'ov': 1, 'uv': 1, 'like': 0,
		}).save().then(function(log) {
			logId = log.id;
		});
	} else {
		if (!localStorage.getItem(url)) {
			log.increment('uv', 1).save().then(function() {
				localStorage.setItem(url, '1');
			});
			if (!sessionStorage.getItem(url)) {
				log.increment('ov', 1).save().then(function() {
					sessionStorage.setItem(url, '1');
				});
			}
		}
		logId = log.id;
		logView = log.attributes.ov;
		logLike = log.attributes.like;
	}
}).then(function() {
	$('.view').attr({
		'data-prev': logView-1 + ' Views',
		'data-next': logView + ' Views',
	}).removeClass('off').addClass('on');
	$('.like').attr({
		'data-prev': logLike + ' Likes',
		'data-next': logLike+1 + ' Likes',
	}).on('click', function() {
		let page = AV.Object.createWithoutData('Counter', logId);
		if (localStorage.getItem(url) !== '2') {
			site.increment('like', 1).save();
			page.increment('like', 1).save().then(function() {
				localStorage.setItem(url, '2');
				$('.like').addClass('on');
			});
		} else {
			site.increment('like', -1).save();
			page.increment('like', -1).save();
			localStorage.setItem(url, '1');
			$(this).removeClass('on');
		}
	}).removeClass('off');
	$('.like.on').attr({
		'data-prev': logLike-1 + ' Likes',
		'data-next': logLike + ' Likes',
	});
});
```

``` css
.like {
	cursor: pointer;
}
.like:hover svg {
	animation: pulse 2s ease-in-out infinite;
}
.like.on svg {
	fill: red;
}
span[class] {
	position: relative;
	color: transparent;
}
span[class]::before, span[class]::after {
	content: attr(data-prev);
	position: absolute;
	left: 1.625rem;
	top: 0;
	line-height: 1.5;
	white-space: nowrap;
	color: black;
	transition: top .2s ease-in-out, opacity .15s .05s ease-in-out;
}
span[class]::after {
	content: attr(data-next);
	top: 100%;
	opacity: 0;
	pointer-events: none;
}
span.on::before {
	top: -100%;
	opacity: 0;
	transition: top .2s ease-in-out, opacity .15s ease-in-out;
	pointer-events: none;
}
span.on::after {
	top: 0;
	opacity: 1;
	transition: top .2s ease-in-out, opacity .15s ease-in-out;
}

@keyframes pulse {
	0% { opacity: 1; }
	30% { opacity: .6; }
	60% { opacity: 1; } 
}
```
