---
title: "Anti-Drone with ML&DL"
date: 2023-11-23
categories: [projects]
excerpt: "Machine learning pipeline for UAV detection using FMCW radar spectrograms and electro-optical sensor fusion."
tags: [anti-drone, fmcw-radar, computer-vision, machine-learning, defense-ai]
---

![Anti-drone system overview](/assets/images/army.jpg){: .img-small-left }

Anti-Drone Project 
(FMCW Radar & Electro-Optical Fusion)

## Overview

The Anti-Drone Project was conducted as part of AI Capacity Competition by the Korean National Defense and Groom program.  
The project focused on designing a low-latency, robust machine-learning pipeline for UAV detection and classification using FMCW radar spectrograms, RCS imagery, and auxiliary RF signals.

---

## Abstract

This project develops an end-to-end drone detection and classification framework based on FMCW radar Doppler spectrograms and radar cross-section (RCS) images.  
Both classical machine learning models (SVM, Random Forest, Gradient Boosting) and deep convolutional neural networks (AlexNet, ResNet, GoogLeNet, SqueezeNet, NASNet) were systematically benchmarked to study trade-offs among accuracy, noise robustness, and real-time inference feasibility on edge hardware.

The resulting pipeline emphasizes deployability, noise tolerance, and reproducibility, aligning with practical defense-oriented radar sensing requirements.

---

## Project Objectives

- Build end-to-end ML framework for drone detection from FMCW radar data  
- Compare classical ML vs. deep CNNs on radar spectrograms  
- Evaluate robustness under noise, latency, and hardware constraints  
- Provide research-grade, reproducible implementation suitable for embedded deployment

---

## Dataset & Preprocessing

| Dataset | Description | Modality |
|------|-------------|----------|
| **Goorm-AI-04 Drone Doppler** | FMCW radar Doppler spectrograms labeled by drone type | FMCW Spectrogram |
| **Goorm-AI-04 RCS Image** | Radar cross-section images of drone surfaces | RCS Imagery |
| **Real Doppler RAD-DAR** | Public FMCW Doppler dataset | FMCW Doppler |
| **Drone RC RF Signal** | RF baseband captures from drone controllers | RF / I-Q |

### Preprocessing Pipeline
- **Flattening & Normalization:** Radar tensors converted to `224 × 224` grayscale images  
- **Transfer Learning Compatibility:** ImageNet-style normalization  
- **Noise Augmentation:** Gaussian noise with σ² ∈ {1e-4 … 1e-2}  
- **Stratified Splits:** Balanced class distribution with 10% validation  
- **Dynamic Range Calibration:** Intensity clipping to suppress saturation artifacts  

---

## Model Architectures

### Classical Machine Learning

| Model | Strength |
|------|----------|
| Linear SVC / SVC | Fast, interpretable baseline |
| Random Forest | Noise-robust ensemble |
| HistGradientBoosting | High accuracy on structured radar features |
| SGDClassifier | Lightweight reference |

### Deep CNN Backbones

| Model | Params (M) | Notes |
|------|------------|------|
| AlexNet | 61.0 | Baseline radar texture learning |
| GoogLeNet | 6.8 | Multi-scale Inception features |
| ResNet-34 / 101 | 21.3 / 44.5 | Stable deep residual learning |
| **SqueezeNet** | **1.2** | Edge-deployment friendly |
| NASNet | 5.3 | Architecture-search optimized |
| MobileNetV2 | 3.5 | Strong accuracy/FLOPs ratio |

All CNNs were fine-tuned from ImageNet pretrained weights using PyTorch.

---

## Training Strategy

- **Framework:** PyTorch 2.x + W&B  
- **Batch Size:** 128 (train) / 20 (eval)  
- **Epochs:** 8–12 with early stopping  
- **Optimizer:** AdamW (lr ∈ {1e-4 … 1e-2})  
- **Mixed Precision:** FP16 where supported  
- **Metrics:** Accuracy, F1, precision, recall, AUC  

---

## Evaluation Methodology

- **Multi-seed validation:** seeds ∈ {21, 42, 77}  
- **Noise stress tests:** σ² ∈ {1e-4 … 1e-2}  
- **Inference profiling:** averaged over 100 runs  
- **Metrics:** micro-F1, latency (μ ± σ)  

---

## Results Summary

| Model | Accuracy (%) | F1 | Avg Inference (s) | Params (M) |
|------|--------------|----|------------------|------------|
| Linear SVC | 92.4 | 0.92 | 0.004 | – |
| HistGBDT | 95.1 | 0.95 | 0.007 | – |
| Random Forest | 94.8 | 0.94 | 0.009 | – |
| **SqueezeNet** | **97.3** | **0.97** | **0.012** | **1.2** |
| ResNet-34 | 96.5 | 0.96 | 0.017 | 21.3 |
| GoogLeNet | 96.9 | 0.96 | 0.015 | 6.8 |

> **SqueezeNet** achieved the best accuracy–efficiency balance, making it the most suitable model for real-time edge deployment.

---

## Noise Robustness Experiment

Accuracy under Gaussian noise perturbation (σ² ∈ {1e-4 … 1e-2}):

![Noise robustness results](/assets/images/additional_noise.png)

**Key observations**
- MobileNetV2 & GoogLeNet remained robust at moderate noise levels  
- ResNet-101 was most stable under heavy noise  
- HistGBDT outperformed SVC/RF among classical models in noisy regimes  

---

## Technical Highlights

- Unified benchmarking of classical ML + deep CNNs  
- Custom radar-to-image collate pipeline  
- Full W&B experiment tracking with reproducible seeds  
- Grad-CAM analysis confirming attention on micro-Doppler regions  

---

## Deployment Considerations

- **Edge optimization:** FP16-quantized SqueezeNet  
- **Performance:** >80 FPS on Jetson Nano  
- **Export:** TorchScript for embedded integration  
- **Noise-aware retraining:** integrated for field adaptation  

---

## Repository

🔗 **GitHub:** https://github.com/jpangece/Anti_Drone_System

| Component | Description |
|---------|-------------|
| CNN models | AlexNet, ResNet, GoogLeNet, SqueezeNet, NASNet |
| Classical ML | SVM, RF, HistGBDT |
| `README.md` | Documentation & setup |
| `wandb/` | Logs, sweeps, dashboards |
