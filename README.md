# Travor - Local Guide Booking Application

Travor is a full-stack web application that connects travelers with local experts for authentic tour experiences. It features real-time messaging, secure Stripe payments, and role-based access control for Travelers, Guides, and Admins.

## 🚀 Technology Stack
* **Frontend:** React.js
* **Database:** Firebase Firestore (NoSQL)
* **Authentication:** Firebase Auth (Email/Password & Google)
* **Storage:** Firebase Storage (Images)
* **Payments:** Stripe API
* **State Management:** React Context API

---

## 🛠️ Prerequisites

To run this project, ensure you have the following installed:
* **Node.js** (v14.0.0 or higher)
* **npm** (Node Package Manager)

---

## ⚙️ Installation & Setup

1.  **Unzip the project folder** (or clone the repository).
2.  Open a terminal in the project root directory.
3.  Install dependencies:
    ```bash
    npm install
    ```
    *(Note: This may take a few minutes depending on internet speed)*

---

## 🔑 Configuration

The project requires Firebase and Stripe configuration to function.
*Note: The configuration keys are currently embedded in `src/firebase.js` for ease of testing.*

If the app fails to connect to the database, please ensure `src/firebase.js` contains valid credentials or create a `.env` file with the provided keys.

---

## ▶️ How to Run

In the project directory, run:

```bash
npm start