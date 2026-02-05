---
title: Canberra
permalink: /history/australia/canberra/
layout: single
classes: wide
author_profile: true
sidebar:
  nav: "history"
---

{% assign city_posts = site.posts
  | where: "country", "AU"
  | where: "city", "Canberra"
  | sort: "date"
  | reverse %}

<h2 style="margin-top:0;">Canberra</h2>
<p style="color:#666;">Canberra travel posts</p>

<div class="entries-grid">
  {% for post in city_posts %}
    {% include archive-single.html type="grid" post=post %}
  {% endfor %}
</div>
