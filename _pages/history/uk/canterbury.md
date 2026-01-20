---
title: Canterbury
permalink: /history/uk/canterbury/
layout: single
classes: wide
author_profile: true
sidebar:
  nav: "history"
---

{% assign city_posts = site.posts
  | where: "country", "UK"
  | where: "city", "Canterbury"
  | sort: "date"
  | reverse %}

<h2 style="margin-top:0;">Canterbury</h2>
<p style="color:#666;">Canterbury travel post</p>

<div class="entries-grid">
  {% for post in city_posts %}
    {% include archive-single.html type="grid" post=post %}
  {% endfor %}
</div>
