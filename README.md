💡 IoT-based EMF Radiation Detector
Portable, multi-spectrum radiation detection leveraging Edge AI for real-time safety classification.

This project successfully integrates four heterogeneous sensors on a single Raspberry Pi computer to monitor Gamma, Ultraviolet (UV), and Electromagnetic Fields (EMF/RF) in real time. We use a machine learning model running directly on the device (Edge AI) to instantly classify radiation levels as safe or unsafe, delivering the result to a live web dashboard.
🌐 Project Architecture & Data Flow
Our system is structured into three integrated layers. A critical success was pivoting from costly cloud functions to an efficient Edge AI model running on the Raspberry Pi.
1. Edge Layer (Data Acquisition & AI Inference)
The Raspberry Pi is the Edge Computing Brain responsible for local intelligence:
Data Collection: The Python application interfaces with four different sensor types, handling the challenge of converting analog voltage signals (from UV/EMF sensors) into digital data for the Pi's GPIO pins.
Local AI Classification: The system loads a scikit-learn model Random Forest and executes the prediction locally, classifying the levels as SAFE or UNSAFE. This eliminates the need for paid cloud compute time.
2. Cloud Messaging Layer
Technology: Firebase Realtime Database
Function: The Pi securely writes the final, classified status to a specific database node (classified-alerts) using a robust, server-to-server connection.
3. Presentation Layer (Dashboard)
Technology: React.js (Vite) hosted on Cloudflare Pages.
Function: The live dashboard uses a real-time listener to instantly read the classified status from Firebase and update the UI with charts, data tables, and the crucial SAFE/UNSAFE alert.
✨ Key Features & Technical Success
Multi-Spectrum Monitoring: Integrates Gamma, UV, EMF, and RF measurements simultaneously.
Cost-Effective AI: Successfully implements Edge AI to avoid cloud function costs by running the ML model on the device.
Real-Time Alerts: Provides instantaneous safety classifications and alerts to the user.
Robust Deployment: Solution uses a verified React/Firebase/Cloudflare pipeline, confirming the system's ability to handle complex cross-platform integration
