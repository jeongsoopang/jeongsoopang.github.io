---
title: Germany 🇩🇪
permalink: /history/germany/
layout: single
classes: germany-page
author_profile: true
sidebar:
  nav: "history"
---

{% assign country_posts = site.posts | where: "country", "DE" | sort: "date" | reverse %}

{% for post in country_posts %}
  {% include archive-single.html type="grid" post=post %}
{% endfor %}
