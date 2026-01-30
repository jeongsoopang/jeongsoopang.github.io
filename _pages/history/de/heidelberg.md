---
title: Heidelberg
permalink: /history/de/heidelberg/
layout: single
classes: wide
author_profile: true
sidebar:
  nav: "history"
---

{% assign city_posts = site.posts
  | where: "country", "DE"
  | where: "city", "Heidelberg"
  | sort: "date"
  | reverse %}

<h2 style="margin-top:0;">Heidelberg</h2>
<p style="color:#666;">Heidelberg travel post</p>

<div class="entries-grid">
  {% for post in city_posts %}
    {% include archive-single.html type="grid" post=post %}
  {% endfor %}
</div>
