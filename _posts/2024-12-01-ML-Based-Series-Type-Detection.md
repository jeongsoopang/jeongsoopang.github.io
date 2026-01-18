---
title: "Cercare Medical — ML-Based DICOM Series Type Detection"
date: 2024-12-01
categories: [projects]
excerpt: "Production-ready machine learning pipeline for MR/CT series type classification using DICOM header metadata."
tags: [medical-ai, dicom, machine-learning, radiology, tabular-ml]
---

<div class="project-top">
  <div class="project-images">
    <img src="/assets/images/cercare_1.jpg" alt="Cercare Medical workspace">
    <img src="/assets/images/cercare_2.jpg" alt="Cercare Medical summit">
  </div>

  <div class="project-text">
    {% capture overview_md %}

Cercare Medical ML Project  
(DICOM Series Type Detection)

## Overview

Radiology workflows depend on correctly identifying imaging series types before reconstruction, post-processing, and downstream analysis.  
In practice, this step is often handled by rule-based systems that rely on fragile assumptions about DICOM metadata, such as consistent `SeriesDescription` strings or vendor-specific tags.

During my internship at Cercare Medical (Denmark), I developed a production-ready machine learning pipeline that classifies MR and CT series types using DICOM header metadata only.  
The system was designed to be robust to missing, inconsistent, or vendor-dependent fields and ultimately replaced a legacy rule-based detector in production.

External validation on partner-hospital datasets demonstrated high accuracy while maintaining conservative behavior through selective prediction.

    {% endcapture %}
    {{ overview_md | markdownify }}
  </div>
</div>

## Abstract

This project presents a supervised machine learning approach for classifying MR and CT imaging series types from DICOM header metadata.  
The pipeline targets practical deployment constraints, including heterogeneous vendors, missing fields, and inconsistent textual descriptions.

A tabular feature representation derived from DICOM headers is used to train gradient-boosted decision tree models.  
To improve robustness, a two-model strategy is employed: a primary model that leverages `SeriesDescription` when available, and a fallback model that excludes it entirely.

A selective prediction mechanism defers low-confidence cases to human review, enabling safe deployment in clinical environments.

---

## Project Goals

- Replace a brittle rule-based series detector with a robust ML-based solution  
- Support classification of 8 MR and 3 CT series types using metadata only  
- Remain functional when key textual fields are missing or unreliable  
- Introduce a conservative abstention policy for ambiguous cases  
- Deliver a pipeline suitable for long-term production use and retraining  

---

## My Contributions
...
