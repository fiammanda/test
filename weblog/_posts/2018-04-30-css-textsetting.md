---
title: CSS 中英文混排字体
tags: [CSS]
---

如果网页上中英文使用不同字体，CSS 声明里英文必须写在前面，然后英文字体就会把中文里的部分标点符号如引号、破折号展示成半角状态。某乎这样对此强迫症的改用直角引号了。

但直角引号真的好麻烦鹅且我对其也有强迫症……

搜了一下发现其实可以用 `@font-face` 的 `unicode-range`。

顺便还找到了[这样的操作](https://github.com/jonathantneal/system-font-css/blob/gh-pages/system-font.css)。

以及据说 `-apple-system` 不能用在缩写式 `font` 开头，会被误认为变量。
