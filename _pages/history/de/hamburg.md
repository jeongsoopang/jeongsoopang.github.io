---
title: Hamburg
permalink: /history/de/hamburg/
layout: single
classes: wide
author_profile: true
sidebar:
  nav: "history"
---

{% assign city_posts = site.posts
  | where: "country", "DE"
  | where: "city", "Hamburg"
  | sort: "date"
  | reverse %}

<h2 style="margin-top:0;">Hamburg</h2>
<p style="color:#666;">Hamburg travel post</p>

<div class="entries-grid">
  {% for post in city_posts %}
    {% include archive-single.html type="grid" post=post %}
  {% endfor %}
</div>
