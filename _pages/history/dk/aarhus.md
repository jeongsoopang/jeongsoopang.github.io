---
title: Aarhus
permalink: /history/dk/aarhus/
layout: single
classes: wide
author_profile: true
sidebar:
  nav: "history"
---

{% assign city_posts = site.posts | where: "country", "DK" | where: "city", "Aarhus" | sort: "date" | reverse %}

<h2 style="margin-top:0;">Aarhus</h2>
<p style="color:#666;">All Aarhus posts</p>

<div class="entries-grid">
  {% for post in city_posts %}
    {% include archive-single.html type="grid" post=post %}
  {% endfor %}
</div>
