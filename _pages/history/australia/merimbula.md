
---
title: Merimbula
permalink: /history/australia/merimbula/
layout: single
classes: wide
author_profile: true
sidebar:
  nav: "history"
---

{% assign city_posts = site.posts
  | where: "country", "AU"
  | where: "city", "Merimbula"
  | sort: "date"
  | reverse %}

<h2 style="margin-top:0;">Merimbula</h2>
<p style="color:#666;">Merimbula travel posts</p>

<div class="entries-grid">
  {% for post in city_posts %}
    {% include archive-single.html type="grid" post=post %}
  {% endfor %}
</div>
