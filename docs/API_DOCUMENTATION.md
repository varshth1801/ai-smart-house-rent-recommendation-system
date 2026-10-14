# AI Smart House Rent Recommendation System - API Documentation

## Base URL
`http://localhost:8080/api`

---

## 1. Authentication APIs (`/api/auth`)

### `POST /api/auth/register`
Creates a new tenant, landlord, or admin account.
- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Alex Mercer",
  "phone": "+91 98765 43210",
  "role": "ROLE_TENANT"
}
```
- **Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 4,
  "email": "user@example.com",
  "fullName": "Alex Mercer",
  "role": "ROLE_TENANT",
  "avatarUrl": "https://..."
}
```

### `POST /api/auth/login`
Authenticates user and returns JWT token.
- **Request Body:**
```json
{
  "email": "tenant@smartrent.ai",
  "password": "password123"
}
```

---

## 2. Property APIs (`/api/properties`)

### `GET /api/properties`
Search and filter properties with query params.
- **Query Parameters:** `city`, `minPrice`, `maxPrice`, `bedrooms`, `propertyType`, `petFriendly`, `parkingAvailable`, `gym`.
- **Response:** Array of Property objects.

### `GET /api/properties/{id}`
Returns full property details, images, amenities, and owner information.

### `POST /api/properties` *(Authorized: Landlord / Admin)*
Lists a new property with coordinates, amenities, and rental pricing.

### `PUT /api/properties/{id}` *(Authorized: Landlord / Admin)*
Updates an existing property.

### `DELETE /api/properties/{id}` *(Authorized: Landlord / Admin)*
Removes a listing.

---

## 3. AI Intelligence APIs (`/api/ai`)

### `POST /api/ai/recommendations`
Generates personalized property matches with explainable scores.
- **Request Body:**
```json
{
  "city": "Bengaluru",
  "maxBudget": 38000,
  "bedrooms": 2,
  "lifestyle": "tech_worker",
  "petFriendly": true,
  "parking": true,
  "gym": true,
  "prioritize": "balanced"
}
```
- **Response (200 OK):**
```json
[
  {
    "property": { "id": 1, "title": "Modern Skyview 2BHK..." },
    "matchPercentage": 94,
    "budgetScore": 98,
    "locationScore": 100,
    "lifestyleScore": 92,
    "amenitiesScore": 95,
    "safetyScore": 98,
    "primaryMatchReason": "Exceptional Match: Fits budget, desired amenities, and lifestyle profile.",
    "highlightPoints": [
      "Highly budget-compatible (Great value per sq. ft)",
      "Located precisely in your desired neighborhood: Bengaluru",
      "100% Pet Friendly with nearby open areas"
    ],
    "aiVerdict": "AI Top Pick - Highly Recommended for immediate viewing."
  }
]
```

### `POST /api/ai/predict-price`
Rental price valuation engine calculating fair market rent and confidence intervals.
- **Request Body:**
```json
{
  "city": "Bengaluru",
  "bedrooms": 2,
  "bathrooms": 2,
  "areaSqft": 1200,
  "locationTier": "TIER_1",
  "furnishedStatus": "FULLY_FURNISHED",
  "parkingAvailable": true,
  "gym": true,
  "swimmingPool": true
}
```

### `POST /api/ai/natural-search`
Natural language query parser converting freeform text into ranked listings.
- **Request Body:**
```json
{ "query": "Find a quiet 2bhk near tech park under 35000 with balcony and gym" }
```

### `POST /api/ai/chat`
AI property chatbot answering tenant questions, lease guidance, and neighborhood metrics.

### `POST /api/ai/compare`
Side-by-side comparison of 2-4 properties with AI winner recommendation and pros/cons.

---

## 4. Bookings & Applications (`/api/bookings`)

### `POST /api/bookings` *(Tenant)*
Submits rental inquiry or schedule tour.

### `GET /api/bookings/tenant` *(Tenant)*
Retrieves tenant's active rental applications.

### `GET /api/bookings/landlord` *(Landlord)*
Retrieves applications received for landlord's properties.

### `PATCH /api/bookings/{id}/status` *(Landlord / Admin)*
Updates status (`APPROVED`, `REJECTED`, `TOUR_SCHEDULED`).

---

## 5. WebSocket STOMP Endpoint
- **URL:** `ws://localhost:8080/ws` (with SockJS fallback `http://localhost:8080/ws`)
- **Subscription Topics:**
  - `/topic/notifications` - Broadcast notifications
  - `/topic/notifications/{userId}` - Personal real-time alerts
