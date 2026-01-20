---
title: "Copenhagen"
permalink: /history/dk/copenhagen/
layout: single
classes: wide
author_profile: true
sidebar:
  nav: "history"
---

{% assign city_posts = site.posts
  | where: "country", "DK"
  | where: "city", "Copenhagen"
  | sort: "date"
  | reverse %}

<p style="margin-top:0.3rem;color:rgba(0,0,0,0.65);">
  Trip posts in Copenhagen (June / July / November).
</p>

<div class="entries-grid">
  {% for post in city_posts %}
    {% include archive-single.html type="grid" %}
  {% endfor %}
</div>
