package com.smartrent.config;

import com.smartrent.entity.*;
import com.smartrent.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           PropertyRepository propertyRepository,
                           ReviewRepository reviewRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
        this.reviewRepository = reviewRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Already initialized
        }

        // 1. Create Default Users
        User admin = new User(
                "admin@smartrent.ai",
                passwordEncoder.encode("password123"),
                "Dr. Sarah Vance (Admin)",
                "+91 98765 00001",
                Role.ROLE_ADMIN
        );
        admin.setAvatarUrl("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80");
        userRepository.save(admin);

        User landlord = new User(
                "landlord@smartrent.ai",
                passwordEncoder.encode("password123"),
                "Vikramaditya Oberoi",
                "+91 98765 11112",
                Role.ROLE_LANDLORD
        );
        landlord.setAvatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80");
        userRepository.save(landlord);

        User tenant = new User(
                "tenant@smartrent.ai",
                passwordEncoder.encode("password123"),
                "Priya Sharma",
                "+91 98765 22223",
                Role.ROLE_TENANT
        );
        tenant.setAvatarUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80");
        tenant.setPreferredCity("Bengaluru");
        tenant.setMaxBudget(38000.0);
        tenant.setPreferredBedrooms(2);
        tenant.setPreferredLifestyle("tech_worker");
        tenant.setPetFriendlyNeeded(true);
        tenant.setParkingNeeded(true);
        tenant.setGymNeeded(true);
        userRepository.save(tenant);

        // 2. Create Realistic, Rich Properties
        Property p1 = new Property();
        p1.setTitle("Modern Skyview 2BHK with Smart Automation");
        p1.setDescription("Sun-drenched luxury 2BHK apartment in the heart of Indiranagar. Featuring Italian marble flooring, smart voice-controlled home automation, high-speed fiber internet ready, and floor-to-ceiling balcony windows overlooking lush tree canopy.");
        p1.setAddress("100 Feet Road, HAL 2nd Stage, Indiranagar");
        p1.setCity("Bengaluru");
        p1.setState("Karnataka");
        p1.setZipCode("560038");
        p1.setNeighborhood("Indiranagar");
        p1.setPrice(34000.0);
        p1.setSecurityDeposit(68000.0);
        p1.setMaintenanceFee(2500.0);
        p1.setBedrooms(2);
        p1.setBathrooms(2);
        p1.setAreaSqft(1250.0);
        p1.setPropertyType(PropertyType.APARTMENT);
        p1.setFurnishedStatus(FurnishedStatus.FULLY_FURNISHED);
        p1.setStatus(PropertyStatus.AVAILABLE);
        p1.setPetFriendly(true);
        p1.setParkingAvailable(true);
        p1.setGym(true);
        p1.setSwimmingPool(true);
        p1.setPowerBackup(true);
        p1.setBalcony(true);
        p1.setAirConditioning(true);
        p1.setWifi(true);
        p1.setElevator(true);
        p1.setSecurity24x7(true);
        p1.setLatitude(12.9716);
        p1.setLongitude(77.6412);
        p1.setLocationTier("TIER_1");
        p1.setSafetyRating(4.9);
        p1.setTransitScore(94);
        p1.setVibeTags("Tech-Hub,Modern,Quiet,Cafes");
        p1.setLandlord(landlord);
        p1.setImageUrls(List.of(
                "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80"
        ));
        propertyRepository.save(p1);

        Property p2 = new Property();
        p2.setTitle("Serene Eco-Villa with Private Garden");
        p2.setDescription("Sprawling 3BHK duplex villa inside an eco-sanctuary gated enclave in Whitefield. Solar powered with organic vegetable backyard garden, double-height living room, jacuzzi in master bath, and dedicated EV vehicle fast charging.");
        p2.setAddress("Greenfield Biosphere, ITPL Main Road, Whitefield");
        p2.setCity("Bengaluru");
        p2.setState("Karnataka");
        p2.setZipCode("560066");
        p2.setNeighborhood("Whitefield");
        p2.setPrice(52000.0);
        p2.setSecurityDeposit(120000.0);
        p2.setMaintenanceFee(4000.0);
        p2.setBedrooms(3);
        p2.setBathrooms(3);
        p2.setAreaSqft(2400.0);
        p2.setPropertyType(PropertyType.VILLA);
        p2.setFurnishedStatus(FurnishedStatus.SEMI_FURNISHED);
        p2.setStatus(PropertyStatus.AVAILABLE);
        p2.setPetFriendly(true);
        p2.setParkingAvailable(true);
        p2.setGym(true);
        p2.setSwimmingPool(true);
        p2.setPowerBackup(true);
        p2.setBalcony(true);
        p2.setAirConditioning(true);
        p2.setWifi(true);
        p2.setElevator(false);
        p2.setSecurity24x7(true);
        p2.setLatitude(12.9698);
        p2.setLongitude(77.7499);
        p2.setLocationTier("TIER_1");
        p2.setSafetyRating(4.8);
        p2.setTransitScore(86);
        p2.setVibeTags("Quiet,Green,Family,Luxury");
        p2.setLandlord(landlord);
        p2.setImageUrls(List.of(
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80"
        ));
        propertyRepository.save(p2);

        Property p3 = new Property();
        p3.setTitle("Minimalist Urban Studio near Metro Station");
        p3.setDescription("Stylishly designed compact studio condo optimized for young working professionals and digital nomads. Includes modular hideaway bed, ergonomic standing desk, high-speed Wi-Fi, and quick 2-minute walk to Metro terminal.");
        p3.setAddress("Koramangala 4th Block, 80 Feet Road");
        p3.setCity("Bengaluru");
        p3.setState("Karnataka");
        p3.setZipCode("560034");
        p3.setNeighborhood("Koramangala");
        p3.setPrice(22000.0);
        p3.setSecurityDeposit(44000.0);
        p3.setMaintenanceFee(1500.0);
        p3.setBedrooms(1);
        p3.setBathrooms(1);
        p3.setAreaSqft(580.0);
        p3.setPropertyType(PropertyType.STUDIO);
        p3.setFurnishedStatus(FurnishedStatus.FULLY_FURNISHED);
        p3.setStatus(PropertyStatus.AVAILABLE);
        p3.setPetFriendly(false);
        p3.setParkingAvailable(true);
        p3.setGym(true);
        p3.setSwimmingPool(false);
        p3.setPowerBackup(true);
        p3.setBalcony(true);
        p3.setAirConditioning(true);
        p3.setWifi(true);
        p3.setElevator(true);
        p3.setSecurity24x7(true);
        p3.setLatitude(12.9352);
        p3.setLongitude(77.6245);
        p3.setLocationTier("TIER_1");
        p3.setSafetyRating(4.7);
        p3.setTransitScore(98);
        p3.setVibeTags("Student,Young-Pro,Tech-Hub,Transit");
        p3.setLandlord(landlord);
        p3.setImageUrls(List.of(
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1502005229762-ee1b2b8ab32f?auto=format&fit=crop&w=1000&q=80"
        ));
        propertyRepository.save(p3);

        Property p4 = new Property();
        p4.setTitle("Panoramic Sea Breeze 3BHK Penthouse");
        p4.setDescription("Ultra-exclusive sea-facing penthouse on Bandra Bandstand with wraparound sundeck terrace, infinity lap pool access, Italian modular kitchen, and private high-speed elevator access.");
        p4.setAddress("BJ Road, Bandra West");
        p4.setCity("Mumbai");
        p4.setState("Maharashtra");
        p4.setZipCode("400050");
        p4.setNeighborhood("Bandra West");
        p4.setPrice(95000.0);
        p4.setSecurityDeposit(250000.0);
        p4.setMaintenanceFee(8000.0);
        p4.setBedrooms(3);
        p4.setBathrooms(3);
        p4.setAreaSqft(2100.0);
        p4.setPropertyType(PropertyType.PENTHOUSE);
        p4.setFurnishedStatus(FurnishedStatus.FULLY_FURNISHED);
        p4.setStatus(PropertyStatus.AVAILABLE);
        p4.setPetFriendly(true);
        p4.setParkingAvailable(true);
        p4.setGym(true);
        p4.setSwimmingPool(true);
        p4.setPowerBackup(true);
        p4.setBalcony(true);
        p4.setAirConditioning(true);
        p4.setWifi(true);
        p4.setElevator(true);
        p4.setSecurity24x7(true);
        p4.setLatitude(19.0596);
        p4.setLongitude(72.8295);
        p4.setLocationTier("TIER_1");
        p4.setSafetyRating(5.0);
        p4.setTransitScore(92);
        p4.setVibeTags("Luxury,Ocean-View,Celebrity,Nightlife");
        p4.setLandlord(landlord);
        p4.setImageUrls(List.of(
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80"
        ));
        propertyRepository.save(p4);

        Property p5 = new Property();
        p5.setTitle("Affordable Cozy 2BHK in Gated Community");
        p5.setDescription("Family-friendly 2BHK apartment with children's play area, badminton court, round-the-clock water supply, and peaceful residential environment. Close to reputed international schools.");
        p5.setAddress("Hinjawadi Phase 1, Near Cognizant Campus");
        p5.setCity("Pune");
        p5.setState("Maharashtra");
        p5.setZipCode("411057");
        p5.setNeighborhood("Hinjawadi");
        p5.setPrice(21000.0);
        p5.setSecurityDeposit(42000.0);
        p5.setMaintenanceFee(1800.0);
        p5.setBedrooms(2);
        p5.setBathrooms(2);
        p5.setAreaSqft(980.0);
        p5.setPropertyType(PropertyType.APARTMENT);
        p5.setFurnishedStatus(FurnishedStatus.SEMI_FURNISHED);
        p5.setStatus(PropertyStatus.AVAILABLE);
        p5.setPetFriendly(true);
        p5.setParkingAvailable(true);
        p5.setGym(true);
        p5.setSwimmingPool(false);
        p5.setPowerBackup(true);
        p5.setBalcony(true);
        p5.setAirConditioning(false);
        p5.setWifi(true);
        p5.setElevator(true);
        p5.setSecurity24x7(true);
        p5.setLatitude(18.5913);
        p5.setLongitude(73.7389);
        p5.setLocationTier("TIER_2");
        p5.setSafetyRating(4.6);
        p5.setTransitScore(82);
        p5.setVibeTags("Quiet,Family,Budget,Tech-Park");
        p5.setLandlord(landlord);
        p5.setImageUrls(List.of(
                "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1000&q=80"
        ));
        propertyRepository.save(p5);

        Property p6 = new Property();
        p6.setTitle("Tech-Corridor Smart 3BHK with Clubhouse");
        p6.setDescription("Contemporary 3BHK condominium inside premium tech corridor with olympic size pool, squash court, co-working lounge, and dedicated concierge desk.");
        p6.setAddress("Financial District, Gachibowli");
        p6.setCity("Hyderabad");
        p6.setState("Telangana");
        p6.setZipCode("500032");
        p6.setNeighborhood("Gachibowli");
        p6.setPrice(38000.0);
        p6.setSecurityDeposit(76000.0);
        p6.setMaintenanceFee(3000.0);
        p6.setBedrooms(3);
        p6.setBathrooms(3);
        p6.setAreaSqft(1650.0);
        p6.setPropertyType(PropertyType.CONDO);
        p6.setFurnishedStatus(FurnishedStatus.FULLY_FURNISHED);
        p6.setStatus(PropertyStatus.AVAILABLE);
        p6.setPetFriendly(false);
        p6.setParkingAvailable(true);
        p6.setGym(true);
        p6.setSwimmingPool(true);
        p6.setPowerBackup(true);
        p6.setBalcony(true);
        p6.setAirConditioning(true);
        p6.setWifi(true);
        p6.setElevator(true);
        p6.setSecurity24x7(true);
        p6.setLatitude(17.4401);
        p6.setLongitude(78.3489);
        p6.setLocationTier("TIER_1");
        p6.setSafetyRating(4.8);
        p6.setTransitScore(89);
        p6.setVibeTags("Tech-Hub,Modern,Clubhouse");
        p6.setLandlord(landlord);
        p6.setImageUrls(List.of(
                "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
                "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1000&q=80"
        ));
        propertyRepository.save(p6);

        // 3. Add Sample Reviews
        reviewRepository.save(new Review(p1, tenant, 5, "Lived here for 6 months - exceptional natural lighting, peaceful surroundings, and the landlord is super responsive!"));
        reviewRepository.save(new Review(p2, tenant, 5, "The eco-villa garden and EV charger made this the best decision for our family and golden retriever!"));
        reviewRepository.save(new Review(p3, admin, 4, "Great compact layout, internet speed was blistering fast, highly recommended for single professionals."));
    }
}
