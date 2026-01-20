---
title: Helsinki
permalink: /history/fi/helsinki/
layout: single
classes: wide
author_profile: true
sidebar:
  nav: "history"
---

{% assign city_posts = site.posts
  | where: "country", "FI"
  | where: "city", "Helsinki"
  | sort: "date"
  | reverse %}

<h2 style="margin-top:0;">Helsinki</h2>

<div class="entries-grid">
  {% for post in city_posts %}
    {% include archive-single.html type="grid" post=post %}
  {% endfor %}
</div>
