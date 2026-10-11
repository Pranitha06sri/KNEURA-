
# KNEURA 🦴
### Evidence-Governed Knee MRI Analysis

KNEURA is a research MVP that assists radiologists in analyzing knee MRI scans using AI-generated findings, explainability visualizations, and evidence-based report generation.

## Features

- **MRI Analysis:** Upload and process DICOM knee MRI studies.
- **AI Inference:** Uses the supplied KNEE-AI 3.3 model to analyze overlapping 5-slice windows.
- **Explainable AI:** Generates class-specific Grad-CAM visualizations.
- **Human Review:** Allows radiologists to approve or reject AI-generated findings.
- **Evidence-Based Reports:** Generates reports using only reviewed findings.
- **Role-Based Views:** Separate interfaces for radiologists, orthopedists, and patients.
- **Audit History:** Records review actions and report changes.
- **Data Export:** Exports finalized reports as JSON.

## Tech Stack

- **Frontend:** React, Vite
- **Backend:** Python, FastAPI
- **AI/ML:** PyTorch, KNEE-AI 3.3, Grad-CAM
- **Medical Imaging:** DICOM
- **Database:** SQLite
- **Storage:** Local `.kneura/` directory

## Prerequisites

- Python
- Node.js 22.6+
- Compatible PyTorch and torchvision versions
- The required KNEE-AI 3.3 model weights

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd KNEURA
```

### 2. Install backend dependencies

```bash
python -m pip install -r backend/requirements.txt
```

### 3. Install frontend dependencies

```bash
npm install
```

### 4. Validate the model

```bash
python -m backend.manage check-model
```

### 5. Create a demo radiologist account

```bash
python -m backend.manage create-user --email radiologist@kneura.local --name "Demo Radiologist" --role radiologist
```

## Run the Application

Open two terminals from the project directory.

**Terminal 1: Start the backend**

```bash
npm run api
```

**Terminal 2: Start the frontend**

```bash
npm run dev
```

Open the application:

- **Frontend:** http://localhost:5173/login
- **API documentation:** http://localhost:8000/docs

## Workflow

1. Upload a knee MRI study in DICOM format.
2. Run AI inference on the study.
3. Review generated findings and Grad-CAM visualizations.
4. Approve or reject findings as a radiologist.
5. Generate a report based on approved findings.
6. Export the finalized report as JSON.

## Project Structure

```text
KNEURA/
├── backend/          # FastAPI backend and AI inference
├── src/              # React frontend
├── public/           # Static frontend assets
├── docs/              # Project documentation
├── .kneura/          # Local application data
├── package.json      # Frontend scripts and dependencies
└── README.md
```

## Important Limitations

- KNEURA is a research prototype, not a clinically validated diagnostic system.
- AI-generated findings require review by a qualified radiologist.
- Grad-CAM provides model-attribution visualizations, not precise lesion segmentation.
- Synthetic demo data must not be interpreted as real patient imaging.
- Production PACS/RIS/EHR integration and hospital-grade security are not provided.

## Disclaimer

KNEURA is intended for research and educational purposes only. It must not be used as a substitute for professional medical judgment or for making clinical decisions.

## License

Add the appropriate license before distributing or publishing this project.
