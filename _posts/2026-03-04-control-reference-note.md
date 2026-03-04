---
title: "Control Allocation & ASMC for Morphing Drones"
categories: [notes, drone]
excerpt: "Concise reference on control allocation matrix, motor thrust–torque mapping, and adaptive sliding mode control for morphing UAVs."
tags: [drone, control, allocation, ASMC, morphing]
mathjax: true
---

> Reference summary for **Morphing UAV Control Design**  
> Focus: **control allocation**, **motor thrust mapping**, **ASMC**

---

# 1) Motor Thrust & Body Torque

## Motor Thrust Model

Quadrotor에서 **motor speed**와 **thrust** 관계는 다음과 같이 모델링된다.

$$
T_i = k_T \omega_i^2
$$

### Variables

- $T_i$ : thrust of motor *i*  
- $k_T$ : thrust coefficient  
- $\omega_i$ : motor angular velocity

---

## Motor Drag Torque

프로펠러 회전으로 인해 **reaction torque**가 발생한다.

$$
\tau_{\psi,i} = k_D \omega_i^2
$$

- $k_D$ : drag coefficient  
- yaw motion을 생성하는 주요 원인

---

## Body Torque Generation

각 모터의 thrust는 **body torque**를 생성한다.

### Roll torque

$$
\tau_\phi = l (T_4 - T_2)
$$

### Pitch torque

$$
\tau_\theta = l (T_1 - T_3)
$$

### Yaw torque

$$
\tau_\psi =
k_D(\omega_1^2 - \omega_2^2 + \omega_3^2 - \omega_4^2)
$$

---

## Visualization

```
    Motor1 (CCW)
       ↑ T1
        |
Motor2 ← → Motor4
     (CW) (CW)
        |   
       ↓ T3    
  Motor3 (CCW)
```


- thrust difference → **roll / pitch torque**
- rotor drag → **yaw torque**

---

# 2) Control Allocation Matrix

## Control Objective

controller는 다음 **virtual control input**을 생성한다.

$$
u =
\begin{bmatrix}
F_T \\
\tau_\phi \\
\tau_\theta \\
\tau_\psi
\end{bmatrix}
$$

- total thrust  
- body torques

하지만 실제 actuator는 **motor thrust**이다.

$$
f =
\begin{bmatrix}
T_1 \\
T_2 \\
T_3 \\
T_4
\end{bmatrix}
$$

---

## Control Allocation Equation

두 벡터 사이 관계는 다음과 같다.

$$
u = B f
$$

여기서

$$
B =
\begin{bmatrix}
1 & 1 & 1 & 1 \\
0 & -l & 0 & l \\
l & 0 & -l & 0 \\
k_D & -k_D & k_D & -k_D
\end{bmatrix}
$$

이것이 **control allocation matrix**이다.

---

## Motor Command

실제 motor thrust는 다음과 같이 계산된다.

$$
f = B^{-1} u
$$

그리고

$$
\omega_i = \sqrt{\frac{T_i}{k_T}}
$$

이 값이 **ESC command**가 된다.

---

# 3) Morphing Drone Problem

일반 quadrotor에서는

- arm length $l$
- inertia
- thrust direction

이 **constant**이다.

하지만 **morphing drone**에서는 그렇지 않다.

---

## Time-Varying Control Allocation

Morphing drone에서는

$$
B = B(t)
$$

즉 **control allocation matrix가 시간에 따라 변한다.**

예시:

| Configuration | Arm Length |
|---|---|
| Normal | $l = 0.25m$ |
| Folded | $l = 0.18m$ |
| Expanded | $l = 0.30m$ |

따라서

$$
\tau_\phi = l(t)(T_4 - T_2)
$$

이 된다.

---

## Example

```
Normal quadrotor

motor ---0.25m--- center

Morphing drone

motor ---0.15m--- center
```


arm length 변화 → **torque effectiveness 변화**

---

## Resulting Problem

Controller는 항상 다음을 계산해야 한다.

$$
f = B(t)^{-1} u
$$

하지만

- modeling error
- actuator uncertainty
- morphing dynamics

이 존재한다.

그래서 **robust controller**가 필요하다.

---

# 4) Adaptive Sliding Mode Control (ASMC)

## Sliding Mode Control

SMC는 **robust nonlinear control** 방법이다.

system

$$
\dot{x} = f(x) + g(x)u + d
$$

여기서

- $d$ : disturbance

---

## Sliding Surface

tracking error

$$
e = x - x_d
$$

sliding surface

$$
s = \dot{e} + \lambda e
$$

---

## SMC Control Law

$$
u = u_{eq} - K \, sign(s)
$$

- $u_{eq}$ : equivalent control
- second term : disturbance rejection

---

## Problem: Chattering

SMC는 다음 문제가 있다.

```
Trajectory Planner
↓
Position Controller
↓
Attitude Controller
↓
ASMC Torque Controller
↓
Control Allocation B(t)^(-1)
↓
Motor Speed Command
↓
ESC → Motor
```

---

# Key Takeaways

- **motor thrust** : $T = k_T \omega^2$  
- **control allocation matrix** maps motor thrust to body torque  
- **morphing drone** → allocation matrix becomes **time-varying**  
- **ASMC** provides **robust control under parameter changes**

---

<sub>© Jeongsoo Pang — Morphing UAV Control Notes</sub>
