---
title: Mobile Safari 资源限制
tags: [JavaScript]
---

TL;DR:

直接移除元素无用，必须修改 src 并等待一段时间。

``` javascript
var img = document.getElementById('previous');
img.parentNode.removeChild(img);
img.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
window.timeout(function() {
	img = null;
}, 60000);
```