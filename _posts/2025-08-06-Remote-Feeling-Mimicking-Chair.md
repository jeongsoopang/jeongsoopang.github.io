---
title: "Remote Feeling Mimicking Chair"
date: 2025-08-06
categories: [projects]
tags: [robotics, stewart-platform, design-expo]
---

![Expo photo of dual-chair haptic system](/assets/images/expo.jpg)

Remote Feeling Mimicking Chair
(Low-Latency Dual-Chair Haptic Teleoperation)

## Overview

**Remote Feeling Mimicking Chair (RFMC)** is a dual-chair haptic teleoperation system that reproduces a remote operator’s seat motion in real time.  
The system synchronizes tilt (pitch/roll) and vibration with sub-10 ms end-to-end latency, demonstrated at the 2025 SJTU Summer Design Expo.

- **Role:** Lead-Developer
- **Affiliation:** UM–SJTU Joint Institute  
- **Sponsor:** BuilderX  
- **Instructor:** Prof. Chengbin Ma  
- **Demo:** 2025 Summer Design Expo

---

## Abstract

This project presents dual-chair haptic teleoperation system that reproduces both tilt (pitch/roll) and vibration of a remote operator’s seat in real time. 

Three-actuator Stewart-inspired platform driven by 24V DC linear actuators achieves a ±15° motion range and ~84 mm/s actuation speed. A 6-axis IMU (ICM-45686) mounted on the source chair streams motion data over Bluetooth Low Energy (BLE) with sub-10 ms latency to an ESP32 controller, which performs real-time inverse-kinematics control via BTS7960 PWM drivers A multi-threaded FreeRTOS firmware handles IMU sampling, BLE communication, and actuator feedback in parallel, enabling smooth motion transitions with negligible delay. Experimental validation at the 2025 SJTU Design Expo confirmed stable operation.

---

## System Overview

The RFMC consists of two physically separated but electronically synchronized platforms:

- **Chair 1 (Source):** Captures inertial data via IMU (motion + vibration).
- **Chair 2 (Replica):** Reconstructs tilt and vibration in real time.

BLE is used for ultra-low latency, enabling command rates up to 300 Hz without packet loss.  

The whole system weighs under 20 kg and can be assembled in less than 45 minutes.

| Subsystem | Key Components | Function |
|---|---|---|
| Sensing | ICM-45686 IMU (6-axis) | Captures motion and vibration up to 1 kHz |
| Processing | ESP32 dual-core MCU | Inverse kinematics + PID control |
| Transmission | BLE GATT protocol | Low-latency relay (< 10 ms) |
| Actuation | 3 × 24 V DC worm-gear linear actuators | Generate seat tilt (pitch/roll) |
| Power | 24 V 10 A DC supply | Shared power for actuators + logic |
| Feedback | 5–10 Hz vibration motor | Simulates terrain resonance |

---

## Mechanical Design and Kinematics

The mechanical platform is triangular and symmetric, with actuators mounted at 0°, 120°, and 240. 

This balances torque loads, reduces coupling, and simplifies equations (3 actuators instead of a full 6-DOF Stewart), while retaining realistic 2-DOF tilt.

### Key Structural Highlights

- **Actuator thrust:** 980 N (≈100 kgf per unit)  
- **Frame:** 6061-T6 aluminum profile + 9 mm plywood seat  
- **Joints:** M8 rod-end ball joints (absorb lateral shear)  
- **Geometry:** Equilateral triangle base, side length 540 mm  
- **Center height:** 230 mm (rest), varies up to ±45 mm during tilt  

Finite Element Analysis (FEA) showed maximum deformation 0.47 mm at 800 N load with Von Mises stress 42.3 MPa, below aluminum yield (~275 MPa). 

Safety factor > 3.1 under full tilt + payload.

The inverse kinematics maps desired Euler angles to actuator lengths using precomputed lookup tables updated at 200 Hz, reducing onboard compute load.

---

## Control and Electronics

### Sensor & Sampling
The IMU runs at 1 kHz raw sampling and is averaged to 100 Hz for transmission stability.  
A complementary Kalman-style filtering strategy reduces noise and bias drift.

### Communication & Timing (BLE)
- **Connection interval:** 7.5 ms  
- **MTU:** 247 bytes  
- **Transmission rate:** ~300 packets/s (orientation + vibration)  
Measured latency: 7.3 ms mean, 99th percentile < 9.4 ms under interference.

### Actuation & Feedback
- **BTS7960 drivers** (43 A peak): PWM 1–2 kHz, bidirectional control  
- **PID loop:** 200 Hz (Kp = 2.1, Ki = 0.4, Kd = 0.12)  
- **Vibration:** PWM-mapped intensity, 5–10 Hz resonance band

### Power
Shared 24 V 10 A DC bus with reverse-polarity protection and EMI filtering.  
Measured draw: ~110 W steady, <160 W peak startup.  
Thermals remained <55°C in continuous operation.

---

## Firmware and Software

ESP32 **dual-core FreeRTOS** enables asynchronous processing:

| Core | Process | Description |
|---|---|---|
| Core 0 | BLE stack | GATT communication + packet integrity |
| Core 1 | Control loop | IK + PID + PWM updates |

### Thread Breakdown
- **Task 1:** IMU read → filtering → queue buffer (1 kHz → 100 Hz)  
- **Task 2:** BLE transmit + checksum validation (~3 ms)  
- **Task 3:** Inverse kinematics + PWM update (5 ms cycle)  
- **Task 4:** Vibration modulation (adaptive 5–10 Hz)  

Precomputed lookup tables reduced compute time by ~60%.  
Retransmission queue achieved 0.00% packet loss under 2.4 GHz interference.

---

## Experimental Validation

| Test | Metric | Result | Notes |
|---|---:|---:|---|
| Tilt accuracy | avg error | < 0.9° | ±15° motion, 5° steps |
| Latency | end-to-end | 7.3 ms mean | < 10 ms pipeline |
| Vibration range | freq. | 5–80 Hz | peak sensitivity 5–10 Hz |
| Actuator speed | speed | 83.7 mm/s | full stroke 3.7 s |
| Payload | capacity | > 1000 N | safety factor ~3× |
| Endurance | runtime | 90 min | temp < 55°C |
| Power | steady | ~110 W | 24 V bus |

A 1000 Hz timestamped serial log confirmed synchronization between source and replica with correlation **r = 0.984** (5 Hz cycles).

---

## Results Discussion

RFMC achieved high realism with minimal delay and low jitter.  
Subjective trials rated realism:

- Tilt response: **4.6 / 5.0**
- Vibration clarity: **4.4 / 5.0**

Compared to commercial systems, RFMC achieved similar responsiveness at significantly lower cost.

| System | DOF | Latency (ms) | Load (N) | Cost (USD) |
|---|---:|---:|---:|---:|
| SimCraft APEX 3 | 3 | 12–15 | 1300 | 14,000 |
| D-BOX G5 | 3 | 10–12 | 1000 | 8,000 |
| **RFMC (ours)** | 2 | **7–9** | **1000** | **~400** |

---

## Applications and Future Work

### Applications
- Remote heavy machinery operation (crane, excavator)
- Training simulators for vehicle operators
- Rehabilitation chairs (vestibular therapy)
- Telepresence in hazardous environments

### Future Enhancements
1. Add force sensing for bidirectional feedback  
2. Expand to 6-DOF (heave/surge/yaw)  
3. Replace BLE with Wi-Fi 6E / private 5G for long-range telepresence  
4. Use AI-based predictive control for motion compensation  

---

## Acknowledgment

Developed under SJTU UM–JI Capstone Design (2025) with BuilderX support.  
This project demonstrates haptic telepresence with compact mechanics and optimized firmware achieving industry-grade responsiveness.
