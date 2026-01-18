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

Cercare Medical ML Project  
(DICOM Series Type Detection)

## Overview

Radiology workflows depend on correctly identifying imaging series types before reconstruction, post-processing, and downstream analysis.  
In practice, this step is often handled by rule-based systems that rely on fragile assumptions about DICOM metadata, such as consistent `SeriesDescription` strings or vendor-specific tags.

During my internship at Cercare Medical (Denmark), I developed a production-ready machine learning pipeline that classifies MR and CT series types using DICOM header metadata only.  
The system was designed to be robust to missing, inconsistent, or vendor-dependent fields and ultimately replaced a legacy rule-based detector in production.

External validation on partner-hospital datasets demonstrated high accuracy while maintaining conservative behavior through selective prediction.

---

## Abstract

This project presents a supervised machine learning approach for classifying MR and CT imaging series types usingfrom DICOM header metadata.  
The pipeline targets practical deployment constraints, including heterogeneous vendors, missing fields, and inconsistent textual descriptions.

A tabular feature representation derived from DICOM headers is used to train gradient-boosted decision tree models.  
To improve robustness, a two-model strategy is employed: a primary model that leverages `SeriesDescription` when available, and a fallback model that excludes it entirely.

A selective prediction mechanism defers low-confidence cases to human review, enabling safe deployment in clinical environments.  
The resulting system achieves high accuracy on external validation data and is designed for maintainability, retraining, and auditability.

---

## Project Goals

- Replace a brittle rule-based series detector with a robust ML-based solution  
- Support classification of 8 MR and 3 CT series types using metadata only  
- Remain functional when key textual fields are missing or unreliable  
- Introduce a conservative abstention policy for ambiguous cases  
- Deliver a pipeline suitable for long-term production use and retraining  

---

## My Contributions

- Designed a DICOM header extraction pipeline tolerant to missing fields, private tags, and vendor variability  
- Implemented preprocessing for mixed-type tabular features with safe handling of unknown values  
- Trained and validated two HistGradientBoosting models per modality:
  - with `SeriesDescription`
  - without `SeriesDescription` as a robust fallback  
- Implemented a selective prediction gate based on confidence and top-2 margin  
- Added SHAP-based explainability to support QA and deployment review  
- Supported external validation and production replacement with serialized artifacts  

---

## Dataset Summary

| Modality | Train | Test |
|---------:|------:|-----:|
| MR       | 171   | 185  |
| CT       | 271   | 407  |

MR labels (8):  
`pwi_dsc`, `pwi_dce`, `swi`, `dwi`, `t2`, `t2_flair`, `t1`, `t1_contrast`

CT labels (3):  
`ct_angiography`, `ct_perfusion`, `ct_noncontrast`

---

## Feature Set

The model relies exclusively on DICOM header metadata.  
Features were selected to balance discriminative power and stability across institutions.

MR examples:
- Sequence timing: `RepetitionTime`, `InversionTime`, `EchoSpacing`, `FlipAngle`
- Acquisition: `PhaseEncodingDirection`, `ScanOptions`
- System-level: `MagneticFieldStrength`
- Optional identifiers: `PulseSequenceName`, `SequenceVariant`
- Diffusion hints: `Bvalue` (when present)

CT examples:
- Contrast and acquisition: `ContrastBolusAgent`, `KVP`, `ExposureTime`
- Reconstruction: `ConvolutionKernel`, `ReconstructionDiameter`
- Table and timing: `TableSpeed`, `SeriesTime`
- General descriptors: `ScanOptions`, `Modality`

---

## System Architecture

### 1. Ingestion
- Input: a multi-series study directory  
- One representative DICOM selected per 3D series to reduce redundancy  

### 2. Header extraction
- Defensive parsing of standard and private tags  
- Normalization into a stable feature schema shared by training and inference  

### 3. Preprocessing
- Numeric features: imputation  
- Categorical features: unknown-safe one-hot encoding  
- Output: model-ready tabular matrix  

### 4. Modeling
HistGradientBoostingClassifier was selected for its suitability to sparse, heterogeneous tabular data:
- robust handling of missing values  
- efficient training and inference  
- strong generalization under regularization  

Two-model strategy:
- primary model includes `SeriesDescription`
- fallback model excludes it entirely  

### 5. Selective prediction

Rather than forcing a prediction for every series, the system abstains when confidence is insufficient.

Typical policy:
- abstain if `max_prob < τ₁`
- abstain if `(top1_prob − top2_prob) < τ₂`

Abstained cases are routed to human review and logged for future retraining.

![Pipeline workflow](/assets/images/workflow.png)

---

## Training & Tuning

Hyperparameter tuning emphasized reproducibility and leakage prevention.

Search space:
- `learning_rate ∈ {0.03, 0.05, 0.07, 0.1}`
- `max_iter ∈ {200, 400, 800}` with early stopping
- `max_leaf_nodes ∈ {15, 31, 63}`
- `min_samples_leaf ∈ {10, 20, 40}`
- `l2_regularization ∈ {0.0, 0.01, 0.05, 0.1}`

Protocol:
1. Patient-level stratified splits  
2. Random search followed by local refinement  
3. Optimization for macro-F1 and per-class recall  
4. Monitoring coverage under selective prediction  

---

## Explainability & QA

- SHAP summaries confirmed reliance on clinically meaningful features  
- Failure cases were reviewed with low-margin and abstained predictions  
- Ablation checks verified stability when key features were removed  

![SHAP summary](/assets/images/test_map.png)

---

## Evaluation

- Internal evaluation using patient-level splits  
- External validation on partner-hospital datasets  
- Metrics tracked:
  - accuracy
  - macro-F1 and per-class recall
  - coverage under selective prediction  

![ROC curve](/assets/images/ROC_curve.png)

---

## Results

External validation performance:
- MR accuracy: 96.69%
- CT accuracy: 99.25%

The system replaced a legacy rule-based detector in production and supports safe iteration through selective prediction and retraining-ready artifacts.

---

## Limitations & Next Steps

- Rare protocol variants remain the primary source of errors  
- Continued data collection will benefit long-tail classes  
- Lightweight normalization of textual fields could improve robustness  
- Future work includes drift monitoring and automated retraining triggers  

---

## Acknowledgment

This project was conducted at Cercare Medical (Denmark, 2024) in collaboration with the AI, software, and operations teams.  
The work culminated in a successful production deployment and a recommendation letter from the CTO.

  </div>
</div>

