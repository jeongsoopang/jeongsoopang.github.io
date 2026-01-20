---
title: Denmark 🇩🇰
permalink: /history/dk/
layout: single
classes: wide
author_profile: true
sidebar:
  nav: "history"
---

<div class="history-country-layout">

  <div class="history-country-left">

    {%- comment -%}
    City landing cards (ONLY 1 card each)
    - Copenhagen page will list June/July/Nov posts inside
    - Aarhus page will list Aarhus posts inside
    These cards also provide lat/lng so the map hover/focus works.
    {%- endcomment -%}

    <a class="history-card"
       href="{{ '/history/dk/copenhagen/' | relative_url }}"
       data-city="Copenhagen"
       data-lat="55.6761"
       data-lng="12.5683"
       data-url="{{ '/history/dk/copenhagen/' | relative_url }}">
      <div class="history-card__title">Copenhagen</div>
      <div class="history-card__excerpt">June / July / November trips</div>
    </a>

    <a class="history-card"
       href="{{ '/history/dk/aarhus/' | relative_url }}"
       data-city="Aarhus"
       data-lat="56.1629"
       data-lng="10.2039"
       data-url="{{ '/history/dk/aarhus/' | relative_url }}">
      <div class="history-card__title">Aarhus</div>
      <div class="history-card__excerpt">Trip posts in Aarhus</div>
    </a>

    {%- comment -%}
    Other DK cards:
    We render all DK posts EXCEPT those that belong to Copenhagen/Aarhus,
    because those will be shown inside the city pages.
    This keeps DK page clean (one card per city).
    {%- endcomment -%}

    {% assign dk_posts = site.posts | where: "country", "DK" %}

    {% assign dk_filtered = "" | split: "" %}
    {% for p in dk_posts %}
      {% assign city = p.city | default: "" %}
      {% if city != "Copenhagen" and city != "Aarhus" %}
        {% assign dk_filtered = dk_filtered | push: p %}
      {% endif %}
    {% endfor %}

    {%- comment -%}
    Render filtered posts as cards using your existing card style.
    We keep markup consistent with your JS selector (.history-card).
    {%- endcomment -%}

    {% for p in dk_filtered %}
      <a class="history-card"
         href="{{ p.url | relative_url }}"
         data-city="{{ p.city | default: '' }}"
         data-lat="{{ p.lat | default: '' }}"
         data-lng="{{ p.lng | default: '' }}"
         data-url="{{ p.url | relative_url }}">
        <div class="history-card__title">{{ p.title }}</div>
        {% if p.excerpt %}
          <div class="history-card__excerpt">{{ p.excerpt }}</div>
        {% endif %}
      </a>
    {% endfor %}

  </div>

  <div class="history-country-right">
    <div id="history-country-map"></div>
    <p style="color:#666; font-size: 0.9rem; margin-top: 0.5rem;">
      Pins are places I visited. Hover a card to focus the pin. Click a pin to open the post.
    </p>
  </div>

</div>

<script>
  // DK 지도 핀 데이터:
  // - Copenhagen/Aarhus는 "도시 랜딩 페이지"로 1개 핀만 표시
  // - 나머지 도시는 개별 포스트 핀 표시
  window.HISTORY_POINTS = [
    {
      title: "Copenhagen",
      url: {{ "/history/dk/copenhagen/" | relative_url | jsonify }},
      city: "Copenhagen",
      lat: 55.6761,
      lng: 12.5683
    },
    {
      title: "Aarhus",
      url: {{ "/history/dk/aarhus/" | relative_url | jsonify }},
      city: "Aarhus",
      lat: 56.1629,
      lng: 10.2039
    }
    {% for p in dk_filtered %}
      ,{
        title: {{ p.title | jsonify }},
        url: {{ p.url | relative_url | jsonify }},
        city: {{ p.city | default: "" | jsonify }},
        lat: {{ p.lat | default: "" | jsonify }},
        lng: {{ p.lng | default: "" | jsonify }}
      }
    {% endfor %}
  ];
</script>

<script src="{{ '/assets/js/history-country-map.js' | relative_url }}"></script>
