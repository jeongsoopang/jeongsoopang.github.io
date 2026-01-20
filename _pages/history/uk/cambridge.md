---
title: Cambridge
permalink: /history/uk/cambridge/
layout: single
classes: wide
author_profile: true
sidebar:
  nav: "history"
---

{% assign city_posts = site.posts
  | where: "country", "UK"
  | where: "city", "Cambridge"
  | sort: "date"
  | reverse %}

<h2 style="margin-top:0;">Cambridge</h2>
<p style="color:#666;">Cambridge travel post</p>

<div class="entries-grid">
  {% for post in city_posts %}
    {% include archive-single.html type="grid" post=post %}
  {% endfor %}
</div>
