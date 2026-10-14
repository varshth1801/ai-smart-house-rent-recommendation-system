-- ========================================================
-- AI SMART HOUSE RENT RECOMMENDATION SYSTEM
-- Database Schema for MySQL 8.x / 9.x
-- ========================================================

CREATE DATABASE IF NOT EXISTS smart_rent_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smart_rent_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role ENUM('ROLE_TENANT', 'ROLE_LANDLORD', 'ROLE_ADMIN') NOT NULL DEFAULT 'ROLE_TENANT',
    avatar_url VARCHAR(500),
    preferred_city VARCHAR(100),
    max_budget DOUBLE,
    preferred_bedrooms INT,
    preferred_lifestyle VARCHAR(100),
    pet_friendly_needed BOOLEAN DEFAULT FALSE,
    parking_needed BOOLEAN DEFAULT FALSE,
    gym_needed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Properties Table
CREATE TABLE IF NOT EXISTS properties (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    landlord_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    zip_code VARCHAR(20),
    neighborhood VARCHAR(100),
    price DOUBLE NOT NULL,
    security_deposit DOUBLE,
    maintenance_fee DOUBLE DEFAULT 0,
    bedrooms INT NOT NULL,
    bathrooms INT NOT NULL,
    area_sqft DOUBLE NOT NULL,
    property_type ENUM('APARTMENT', 'INDEPENDENT_HOUSE', 'VILLA', 'STUDIO', 'CONDO', 'PENTHOUSE') NOT NULL DEFAULT 'APARTMENT',
    furnished_status ENUM('FULLY_FURNISHED', 'SEMI_FURNISHED', 'UNFURNISHED') NOT NULL DEFAULT 'SEMI_FURNISHED',
    status ENUM('AVAILABLE', 'RENTED', 'PENDING_VERIFICATION', 'ARCHIVED') NOT NULL DEFAULT 'AVAILABLE',
    available_from DATE,
    pet_friendly BOOLEAN DEFAULT FALSE,
    parking_available BOOLEAN DEFAULT FALSE,
    gym BOOLEAN DEFAULT FALSE,
    swimming_pool BOOLEAN DEFAULT FALSE,
    power_backup BOOLEAN DEFAULT FALSE,
    balcony BOOLEAN DEFAULT FALSE,
    air_conditioning BOOLEAN DEFAULT FALSE,
    wifi BOOLEAN DEFAULT FALSE,
    elevator BOOLEAN DEFAULT FALSE,
    security_24x7 BOOLEAN DEFAULT FALSE,
    latitude DOUBLE,
    longitude DOUBLE,
    location_tier VARCHAR(50) DEFAULT 'TIER_1',
    safety_rating DOUBLE DEFAULT 4.5,
    transit_score INT DEFAULT 80,
    vibe_tags VARCHAR(255) DEFAULT 'Quiet,Modern',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (landlord_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_prop_city (city),
    INDEX idx_prop_price (price),
    INDEX idx_prop_beds (bedrooms),
    INDEX idx_prop_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Property Images
CREATE TABLE IF NOT EXISTS property_images (
    property_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Rental Booking & Applications Table
CREATE TABLE IF NOT EXISTS booking_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT NOT NULL,
    tenant_id BIGINT NOT NULL,
    landlord_id BIGINT NOT NULL,
    requested_move_in_date DATE,
    lease_duration_months INT DEFAULT 12,
    message TEXT,
    monthly_income DOUBLE,
    employment_status VARCHAR(100),
    number_of_occupants INT DEFAULT 1,
    has_pets BOOLEAN DEFAULT FALSE,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'TOUR_SCHEDULED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    tour_date_time DATETIME,
    tour_type VARCHAR(50),
    landlord_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (landlord_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipient_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    link VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Saved / Favorite Properties Table
CREATE TABLE IF NOT EXISTS saved_properties (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    property_id BIGINT NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_property (user_id, property_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
