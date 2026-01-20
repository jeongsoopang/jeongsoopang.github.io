---
title: London
permalink: /history/uk/london/
layout: single
classes: wide
author_profile: true
sidebar:
  nav: "history"
---

{% assign city_posts = site.posts
  | where: "country", "UK"
  | where: "city", "London"
  | sort: "date"
  | reverse %}

<h2 style="margin-top:0;">London</h2>
<p style="color:#666;">London travel post</p>

<div class="entries-grid">
  {% for post in city_posts %}
    {% include archive-single.html type="grid" post=post %}
  {% endfor %}
</div>
