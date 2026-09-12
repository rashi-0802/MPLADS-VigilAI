# MPLADS VigilAI
**Problem Statement ID:** SIH26102  
**Problem Statement:** AI powered MPLAD Fraud/Anomaly Detection  
**Theme:** Smart Automation | **Category:** Software  
**Hackathon:** Smart India Hackathon (SIH) 2026  

---

## 1. Executive Summary & Presentation Pitch (2-Minute Read)

> **"Detect unusual patterns → generate explainable risk alerts → prioritize projects for human investigation."**

Under the **Members of Parliament Local Area Development Scheme (MPLADS)**, each MP recommends ₹5 Crore worth of developmental works annually across districts. With tens of thousands of decentralized physical and financial transactions occurring nationwide, identifying irregularities, chronic execution delays, ghost fund drawdowns, and duplicate works manually is nearly impossible.

**MPLADS VigilAI** does **not** make reckless automated accusations of legal fraud. Instead, it operates as an **audit intelligence decision-support platform**:
1. It continuously computes cohort benchmarks and statistically normal cost/delay distributions.
2. It executes a hybrid pipeline combining deterministic statutory compliance rules, multidimensional Isolation Forest ML models, and NLP semantic duplicate detection.
3. It generates **plain-English explainable alerts** with tangible numerical evidence.
4. It prioritizes the highest-risk projects into an actionable **Investigation Queue** for authorized district collectors and MoSPI audit inspectors to verify on the ground.

---

## 2. Core Operational Workflow

```
       [ MPLADS Project Ingestion ] (CSV / MoSPI Open Data)
                    │
                    ▼
     [ Stage 1: Data Validation Engine ]
       • Sanctioned cost limits & non-negative funds
       • Date chronology & physical progress constraints
                    │
                    ▼
     [ Stage 2: Statistical Cohort Engine ]
       • Peer medians (Cost / Payment Frequency by Project Category)
       • IQR Fences (Q1 - 1.5×IQR, Q3 + 1.5×IQR)
       • Financial vs. Physical Progress Gap calculation
                    │
                    ▼
     [ Stage 3: ML Anomaly Detection (Isolation Forest) ]
       • Multi-feature space: [Cost Ratio, Progress Gap, Delay, Payment Ratio, Duration]
       • Ensemble random partition trees identifying multivariate outliers
                    │
                    ▼
     [ Stage 4: Duplicate / Similar Work NLP Engine ]
       • Shingle-based word n-grams & TF-IDF similarity matrix
       • Geographic block & district proximity filter (>80% similarity threshold)
                    │
                    ▼
     [ Stage 5: Multi-Signal Composite Risk Scorer (0 - 100) ]
       • Cost Anomaly (25%) + Progress Gap (25%) + Delay (20%)
       • Payment Frequency (15%) + Duplicate Work (10%) + ML Score (5%)
                    │
                    ▼
     [ Stage 6: Explainable Alerts & Dossier ]
       • "Why Was This Project Flagged?" plain-language cards
       • Exact benchmark evidence vs actual metrics
                    │
                    ▼
     [ Stage 7: Auditor Investigation Queue & CitiZen Portal ]
       • Prioritized triage backlog with review status workflow
       • Citizen reporting & ground-level grievance logging
```

---

## 3. Mathematical Risk Scoring Formula

Composite Risk Score $R \in [0, 100]$:
$$R = 0.25 \cdot S_{\text{Cost}} + 0.25 \cdot S_{\text{Gap}} + 0.20 \cdot S_{\text{Delay}} + 0.15 \cdot S_{\text{Payment}} + 0.10 \cdot S_{\text{Duplicate}} + 0.05 \cdot S_{\text{ML}}$$

- **High Risk (70 – 100):** Immediate field audit required. Substantial discrepancy across multiple orthogonal signals.
- **Medium Risk (40 – 69):** Targeted desk inquiry or document clarification required.
- **Low Risk (0 – 39):** Parameters within statistically normal peer cohort boundaries.

---

## 4. Key Pre-Planted Hackathon Demonstration Cases

The prototype includes a realistic synthetic dataset of **1,000 projects** with specific anomalies pre-planted for judge verification:

### Case 1: High-Risk Road Project (`MPLAD-DEMO-1023`)
- **Location:** Village ABC, Barmer District, Rajasthan
- **Composite Risk Score:** **91 / 100 (HIGH RISK)**
- **Why Flagged:**
  1. 🔴 **Cost Anomaly:** Sanctioned cost ₹88.0 Lakh vs peer cohort median of ₹24.0 Lakh (3.67× higher).
  2. 🔴 **Progress Mismatch:** 91.8% financial spend disbursed with only 32.0% physical completion on ground (59.8 percentage point deficit).
  3. 🟠 **Execution Delay:** 18 months overdue beyond sanctioned completion date.
  4. 🟠 **Abnormal Transactions:** 34 payment installments recorded vs peer norm of 5–8 payments.

### Case 2: Potential Duplicate Work (`MPLAD-DEMO-1456` & `MPLAD-DEMO-1457`)
- **Location:** Rampura Gram Panchayat, Jaipur, Rajasthan
- **Composite Risk Score:** **78 / 100 (HIGH RISK)**
- **Why Flagged:**
  1. 🔴 **Semantic Duplicate Work:** 94% NLP similarity detected for "Construction of Community Hall and Public Cultural Centre" in the same gram panchayat sanctioned within 3 months of each other.
  2. 🔍 **Auditor Action:** Cross-verify GPS coordinates and Revenue Khatauni to ensure funds were not sanctioned twice for the same physical structure.

---

## 5. System Features

| Module | Purpose |
|---|---|
| **Executive Dashboard** | High-level MoSPI leadership KPIs: Total spend, risk distribution, alert breakdown, and fast triage. |
| **Investigation Queue** | Comprehensive table with multi-facet filtering (State, District, Risk Level, Anomaly Type), CSV export, and review status workflow. |
| **Project Dossier Modal** | Complete evidence brief: Multi-signal score decomposition, progress disparity bar, side-by-side duplicate comparison, rule checks, and auditor notes. |
| **Alert Centre** | Prioritized alert feed displaying critical deviations with direct access to dossiers. |
| **Geographic Heatmap** | Interactive SVG district risk visualizer without artificial GPS hallucinations. |
| **Analytics Module** | Recharts visualizations of state risk loads, delay distributions, and financial-vs-physical scatter charts. |
| **CitiZen Transparency** | Citizen-facing portal to inspect local works and submit verified ground-level grievance reports. |
| **Data Ingestion & Rules** | Ingest custom CSV datasets or toggle compliance rules dynamically. |

---

## 6. How to Run the Prototype

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.
4. Click **"Run Analysis"** in the top navigation bar or click **"Judge Demo Walkthrough"** to step through the 2-minute evaluation sequence.

---

## 7. Compliance and Ethical Safeguards

- **Statutory Disclaimer:** Every dossier and report features an official advisory indicating that risk scores represent unusual data patterns that warrant administrative inquiry, not definitive declarations of fraud.
- **Privacy First:** Citizen grievance submissions mask personal phone numbers and identities from public view.
- **Explainability Over Black Boxes:** No uninterpretable neural network outputs; every risk point is mapped directly to human-verifiable evidence and peer cohort benchmarks.
