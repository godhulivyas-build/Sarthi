# Sarthi — AI-Enabled Agri Logistics Platform

**Sarthi** is an AI-augmented logistics solution designed to simplify farm-to-market transport for farmers and traders.  
By combining user research insights with digital workflows, Sarthi improves delivery efficiency, transparency, and trust across agricultural supply chains.

---

##  Product Vision

Farmers and small traders often struggle with:
- Opaque pricing
- Delivery delays
- Lack of real-time tracking
- Poor communication with transport providers

**Sarthi’s goal** is to address these challenges by providing:
✔ Easy onboarding  
✔ Route and delivery tracking  
✔ Timely status updates  
✔ Metrics that help reduce average delivery delays

---

##  Key Features

- **User interviewing & research insights**
- **Order creation and assignment**
- **Real-time delivery tracking**
- **AI-assisted ETA and delay prediction**
- **Performance dashboards**

---

## 📁 Project Structure
Sarthi/
├── data/ # Dataset files
├── notebooks/ # EDA & prototype notebooks
├── src/ # Application source code
│ ├── models/ # Prediction & ML logic
│ ├── api/ # Backend endpoints
│ └── utils/ # Utilities
├── screenshots/ # UI & working screenshots
├── video/ # Demo video
├── app.py # Main application script
├── requirements.txt # Dependencies
└── README.md



---

## Live Demo / Video Walkthrough

🔗 **Video demonstration:**  
*((https://drive.google.com/file/d/1gxPvkx-5U-ZHlvnnQy6I0EJWB_3NLI3G/view?usp=sharing))*  


## 🛠 Setup & Installation

### 1) Clone the repository

```bash
git clone https://github.com/godhulivyas-build/Sarthi.git
cd Sarthi
###2) Create & activate a virtual environment
python3 -m venv venv
source venv/bin/activate  # Linux / Mac
venv\Scripts\activate     # Windows

###3) Install dependencies
pip install -r requirements.txt

###4) Run the application
python app.py

The app should now be available at:

http://localhost:5000
