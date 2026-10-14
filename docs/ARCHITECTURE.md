# AI Smart House Rent Recommendation System - Architecture

## System Architecture Overview

```mermaid
graph TD
    Client["React 19 + Vite Frontend\n(Tailwind CSS, STOMP/SockJS, Context API)"]
    Gateway["Spring Boot 3.2.x REST & STOMP APIs"]
    Security["Spring Security 6 (Stateless JWT Filter)"]
    
    subgraph Backend_Services ["Spring Core Engine"]
        AiEngine["AI Service\n- Multi-factor Scoring\n- NLP Search Parser\n- Price Predictor Heuristics\n- External LLM / Gemini Fallback"]
        PropService["Property Service & Search"]
        BookingService["Booking & Tour Service"]
        NotifService["Notification & STOMP Broker"]
        UserService["User & Preference Profiles"]
    end
    
    subgraph Data_Tier ["Persistence Tier"]
        JPA["Spring Data JPA / Hibernate"]
        H2["H2 In-Memory DB (Default Local)"]
        MySQL["MySQL 8.x Database (Production Profile)"]
    end

    Client -->|HTTP / REST (JWT)| Security
    Client <-->|WebSocket / STOMP| NotifService
    Security --> Gateway
    Gateway --> PropService
    Gateway --> AiEngine
    Gateway --> BookingService
    Gateway --> UserService
    PropService --> JPA
    BookingService --> JPA
    UserService --> JPA
    JPA -.-> H2
    JPA -.-> MySQL
```

## Core Design Principles

1. **Dual Database Zero-Friction Execution**:
   - Out of the box, runs locally with high-performance embedded in-memory database with MySQL compatibility dialect, avoiding local DB setup hurdles.
   - Fully enabled for enterprise MySQL deployments by setting `SPRING_PROFILES_ACTIVE=mysql` with environment variables.

2. **Transparent, Explainable AI**:
   - The recommendation algorithm computes normalized multi-attribute scores (Budget, Location, Lifestyle, Amenities, Safety/Transit).
   - Generates transparent explainability meters for each listing (e.g. Budget Fit 98%, Location Fit 100%, Lifestyle 92%), so tenants clearly understand *why* a home is suggested.

3. **Hybrid AI Engine**:
   - Connects to modern real LLMs (Gemini / OpenAI API) when `AI_API_KEY` is configured.
   - Includes an embedded domain-trained rule engine ensuring 100% operational uptime without requiring paid external API subscriptions.
