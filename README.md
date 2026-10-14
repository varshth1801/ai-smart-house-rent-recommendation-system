# 🏠 AI Smart House Rent Recommendation System

An intelligent, full-stack real-estate rental and recommendation platform powered by Spring Boot 3, Java 21, React 19, Tailwind CSS, WebSockets, and Machine Learning/AI heuristics.

---

## 🌟 Key Highlights

- 🧠 **AI-Powered Property Recommendations**: Personalized multi-factor matching algorithms with transparent, explainable scoring breakdown (Budget, Location, Lifestyle, Amenities, Safety, Transit).
- 💬 **Natural Language Property Search**: Conversational search parser (e.g., *"Quiet 2bhk near tech park under 35000 with balcony"*).
- 📈 **AI Rental Price Predictor**: Machine learning valuation engine predicting fair market rent with confidence intervals and price/sqft analytics.
- 🤖 **Interactive AI Real-Estate Assistant (Chatbot)**: Real-time conversational helper answering tenant inquiries, lease guidelines, and pet policies.
- ⚖️ **Side-by-Side Property Comparison**: Multi-property feature comparison with AI-generated pros, cons, and value winner.
- 🔔 **Real-Time WebSocket Notifications**: Instant STOMP alerts for inquiries, applications, and tour approvals.
- 👥 **Role-Based Access Control**: Tailored workflows for **Tenants**, **Landlords**, and **Admins**.
- ⚡ **Zero-Friction Local Execution**: Out-of-the-box in-memory execution (H2 with MySQL compatibility) or enterprise production MySQL.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, Lucide React, Axios, React Router 7, SockJS & STOMP |
| **Backend** | Java 21, Spring Boot 3.2.5, Spring Security 6, JJWT 0.12.5, Spring Data JPA, Hibernate, WebSocket STOMP |
| **Database** | MySQL 8.x / 9.x ready (with zero-config H2 local profile) |
| **AI Engine** | Hybrid: Real LLM (Gemini / OpenAI API) + Built-in offline expert valuation model |

---

## 🚀 Quick Start (Running Locally)

### Prerequisites
- **Java 21** or higher
- **Maven 3.8+**
- **Node.js v18+** & **npm**

---

### Step 1: Start the Backend (Spring Boot)

Open a terminal and run:
```bash
cd backend
mvn spring-boot:run
```
*The backend starts at `http://localhost:8080`. Seed data and sample listings are automatically initialized!*

---

### Step 2: Start the Frontend (Vite + React)

Open another terminal and run:
```bash
cd frontend
npm install
npm run dev
```
*The web app will open at `http://localhost:5173`.*

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Tenant** | `tenant@smartrent.ai` | `password123` |
| **Landlord** | `landlord@smartrent.ai` | `password123` |
| **Admin** | `admin@smartrent.ai` | `password123` |

---

## 📂 Project Structure

```
smart-rent-ai/
├── backend/                  # Spring Boot 3 Java 21 Application
│   ├── src/main/java/com/smartrent/
│   │   ├── ai/              # Multi-factor AI recommendation & price prediction
│   │   ├── config/          # Security, DataInitializer, WebConfig
│   │   ├── controller/      # REST API Controllers
│   │   ├── dto/             # Request & Response Data Transfer Objects
│   │   ├── entity/          # JPA Entities (User, Property, Booking, Review, etc.)
│   │   ├── exception/       # Global exception handling
│   │   ├── repository/      # Spring Data JPA Repositories
│   │   ├── security/        # JWT Authentication Filter, Provider & UserDetails
│   │   ├── service/         # Core business logic & Notification service
│   │   └── websocket/       # STOMP broker configuration & message models
│   └── pom.xml
├── frontend/                 # React 19 + Vite Application
│   ├── src/
│   │   ├── components/      # Navbar, Footer, AI Chatbot, PropertyCard, etc.
│   │   ├── context/         # AuthContext, NotificationContext
│   │   ├── pages/           # Home, Explore, PropertyDetails, AiMatch, PricePredictor, Compare, Dashboard, Login, Register
│   │   ├── services/        # Axios API clients & WebSocket STOMP client
│   │   └── App.jsx
│   └── package.json
├── database/                 # MySQL Database Scripts
│   ├── schema.sql           # Complete MySQL DDL tables
│   └── data.sql             # Seed data with realistic sample properties
├── docs/                     # Technical Documentation
│   ├── API_DOCUMENTATION.md # Complete REST & WebSocket API specification
│   ├── ARCHITECTURE.md      # System architecture & mermaid diagrams
│   └── USER_GUIDE.md        # Comprehensive user & tester guide
├── .env.example              # Environment variables template
├── .gitignore                # Root gitignore
└── README.md
```

---

## ⚙️ Using MySQL in Production

To use an external MySQL database instead of the embedded engine:
1. Create a MySQL database using `database/schema.sql` and `database/data.sql`:
   ```bash
   mysql -u root -p < database/schema.sql
   mysql -u root -p < database/data.sql
   ```
2. Set the environment variable:
   ```bash
   export SPRING_PROFILES_ACTIVE=mysql
   export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/smart_rent_db"
   export SPRING_DATASOURCE_USERNAME=root
   export SPRING_DATASOURCE_PASSWORD=your_password
   ```
3. Run `mvn spring-boot:run`.
