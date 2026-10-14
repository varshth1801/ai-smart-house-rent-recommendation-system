-- ========================================================
-- AI SMART HOUSE RENT RECOMMENDATION SYSTEM
-- Database Seed Data Script
-- Default password for all seed accounts is: password123
-- (Bcrypt hash: $2a$10$w857Z0rXq5Oti4WcZ5WJpON6V3m6v409q1kQ87g7rV6zP6dD.oDey)
-- ========================================================

USE smart_rent_db;

-- 1. Insert Initial Users
INSERT INTO users (id, email, password, full_name, phone, role, avatar_url, preferred_city, max_budget, preferred_bedrooms, preferred_lifestyle, pet_friendly_needed, parking_needed, gym_needed)
VALUES 
(1, 'admin@smartrent.ai', '$2a$10$tZ92i52f6rU53Y18x0v29.3kI.rX7eF72uC3F0xU3jO0kQ2Wv9zvy', 'Dr. Sarah Vance (Admin)', '+91 98765 00001', 'ROLE_ADMIN', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80', NULL, NULL, NULL, NULL, 0, 0, 0),
(2, 'landlord@smartrent.ai', '$2a$10$tZ92i52f6rU53Y18x0v29.3kI.rX7eF72uC3F0xU3jO0kQ2Wv9zvy', 'Vikramaditya Oberoi', '+91 98765 11112', 'ROLE_LANDLORD', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', NULL, NULL, NULL, NULL, 0, 0, 0),
(3, 'tenant@smartrent.ai', '$2a$10$tZ92i52f6rU53Y18x0v29.3kI.rX7eF72uC3F0xU3jO0kQ2Wv9zvy', 'Priya Sharma', '+91 98765 22223', 'ROLE_TENANT', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', 'Bengaluru', 38000, 2, 'tech_worker', 1, 1, 1);

-- 2. Insert Properties
INSERT INTO properties (id, landlord_id, title, description, address, city, state, zip_code, neighborhood, price, security_deposit, maintenance_fee, bedrooms, bathrooms, area_sqft, property_type, furnished_status, status, available_from, pet_friendly, parking_available, gym, swimming_pool, power_backup, balcony, air_conditioning, wifi, elevator, security_24x7, latitude, longitude, location_tier, safety_rating, transit_score, vibe_tags)
VALUES
(1, 2, 'Modern Skyview 2BHK with Smart Automation', 'Sun-drenched luxury 2BHK apartment in the heart of Indiranagar with Italian marble and smart automation.', '100 Feet Road, HAL 2nd Stage, Indiranagar', 'Bengaluru', 'Karnataka', '560038', 'Indiranagar', 34000, 68000, 2500, 2, 2, 1250, 'APARTMENT', 'FULLY_FURNISHED', 'AVAILABLE', '2026-11-01', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12.9716, 77.6412, 'TIER_1', 4.9, 94, 'Tech-Hub,Modern,Quiet,Cafes'),
(2, 2, 'Serene Eco-Villa with Private Garden', 'Sprawling 3BHK duplex villa inside an eco-sanctuary gated enclave in Whitefield with private organic garden.', 'Greenfield Biosphere, ITPL Main Road', 'Bengaluru', 'Karnataka', '560066', 'Whitefield', 52000, 120000, 4000, 3, 3, 2400, 'VILLA', 'SEMI_FURNISHED', 'AVAILABLE', '2026-11-15', 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 12.9698, 77.7499, 'TIER_1', 4.8, 86, 'Quiet,Green,Family,Luxury'),
(3, 2, 'Minimalist Urban Studio near Metro Station', 'Stylishly designed compact studio condo optimized for young working professionals with ergonomic workspace.', 'Koramangala 4th Block, 80 Feet Road', 'Bengaluru', 'Karnataka', '560034', 'Koramangala', 22000, 44000, 1500, 1, 1, 580, 'STUDIO', 'FULLY_FURNISHED', 'AVAILABLE', '2026-10-20', 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 12.9352, 77.6245, 'TIER_1', 4.7, 98, 'Student,Young-Pro,Tech-Hub,Transit'),
(4, 2, 'Panoramic Sea Breeze 3BHK Penthouse', 'Ultra-exclusive sea-facing penthouse on Bandra Bandstand with wraparound terrace and infinity pool access.', 'BJ Road, Bandra West', 'Mumbai', 'Maharashtra', '400050', 'Bandra West', 95000, 250000, 8000, 3, 3, 2100, 'PENTHOUSE', 'FULLY_FURNISHED', 'AVAILABLE', '2026-11-01', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 19.0596, 72.8295, 'TIER_1', 5.0, 92, 'Luxury,Ocean-View,Celebrity,Nightlife');

-- 3. Insert Property Images
INSERT INTO property_images (property_id, image_url) VALUES
(1, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'),
(1, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80'),
(2, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'),
(2, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80'),
(3, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'),
(4, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80');

-- 4. Sample Reviews
INSERT INTO reviews (id, property_id, user_id, rating, comment) VALUES
(1, 1, 3, 5, 'Lived here for 6 months - exceptional natural lighting, peaceful surroundings, and landlord is super responsive!'),
(2, 2, 3, 5, 'The eco-villa garden and EV charger made this the best decision for our family and golden retriever!');
