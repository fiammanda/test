---
layout: weblog
title: 将 Gridea 部署到 Gitee
tags: [Gridea, Web]
---

部署到 Gitee 需要已经在 Github 上部署好的 Gridea 和一个 Gitee 账号（废话）。 <!-- more -->

然后必须对站内链接进行处理，不然 Gitee 站内点击都会直接跳转到 Github。存在两种情况：

如果部署在根目录就很方便，直接绝对路径：

- 主页：`href="/"`
- 文章：`href="/post/<%= post.fileName %>"`
- 标签：`href="/tag/<%= tag.slug %>"`
- 样式：`href="/styles/main.css"`

如果像我一样没放在根目录就要稍稍进行一些处理……使用相对路径：

- 主页：`href=""`
- 文章：`href="post/<%= post.fileName %>"`
- 标签：`href="tag/<%= tag.slug %>"`
- 样式：`href="styles/main.css"`

重点在于在 `head` 内对 `base` 进行设置：

```
<base href="<%- base() %>">
<% function base() {
	return themeConfig.domain.indexOf('localhost') > 0 ? themeConfig.domain : '/所在目录/';
} %>
```

这样本地预览和云端都能达到同样效果。

最后用 Gitee 导入 Github Repo，每次推送手工同步一下（……）就好惹。
