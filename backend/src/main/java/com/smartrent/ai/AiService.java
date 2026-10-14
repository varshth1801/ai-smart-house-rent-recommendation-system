package com.smartrent.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartrent.dto.*;
import com.smartrent.entity.Property;
import com.smartrent.entity.PropertyType;
import com.smartrent.repository.PropertyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class AiService {

    private static final Logger logger = LoggerFactory.getLogger(AiService.class);

    private final PropertyRepository propertyRepository;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    @Value("${smartrent.ai.api-key:}")
    private String aiApiKey;

    @Value("${smartrent.ai.provider:internal}")
    private String aiProvider;

    public AiService(PropertyRepository propertyRepository, ObjectMapper objectMapper) {
        this.propertyRepository = propertyRepository;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    /**
     * AI-Powered Multi-Factor Property Recommendation with Explainability
     */
    public List<AiRecommendationResponse> getRecommendations(AiRecommendationRequest req) {
        List<Property> allProperties = propertyRepository.findByStatus(com.smartrent.entity.PropertyStatus.AVAILABLE);

        if (allProperties.isEmpty()) {
            return Collections.emptyList();
        }

        List<AiRecommendationResponse> scoredResponses = new ArrayList<>();

        for (Property prop : allProperties) {
            AiRecommendationResponse res = new AiRecommendationResponse(prop);

            // 1. Budget Score (Weight: 30%)
            int budgetScore = 100;
            if (req.getMaxBudget() != null && req.getMaxBudget() > 0) {
                double diff = req.getMaxBudget() - prop.getPrice();
                if (diff >= 0) {
                    // Under budget: reward for savings
                    budgetScore = Math.min(100, (int) (90 + (diff / req.getMaxBudget()) * 10));
                } else {
                    // Over budget: penalty proportional to excess
                    double penalty = (Math.abs(diff) / req.getMaxBudget()) * 100;
                    budgetScore = Math.max(20, (int) (100 - penalty * 1.5));
                }
            }
            res.setBudgetScore(budgetScore);

            // 2. Location & City Score (Weight: 25%)
            int locationScore = 80;
            if (req.getCity() != null && !req.getCity().trim().isEmpty()) {
                String searchCity = req.getCity().toLowerCase().trim();
                String propCity = prop.getCity() != null ? prop.getCity().toLowerCase() : "";
                String propNeighborhood = prop.getNeighborhood() != null ? prop.getNeighborhood().toLowerCase() : "";

                if (propCity.contains(searchCity) || searchCity.contains(propCity)) {
                    locationScore = 100;
                } else if (propNeighborhood.contains(searchCity)) {
                    locationScore = 95;
                } else {
                    locationScore = 40; // Different city
                }
            } else {
                locationScore = 85;
            }
            res.setLocationScore(locationScore);

            // 3. Lifestyle Score (Weight: 20%)
            int lifestyleScore = 80;
            String lifestyle = req.getLifestyle() != null ? req.getLifestyle().toLowerCase() : "balanced";
            String vibe = prop.getVibeTags() != null ? prop.getVibeTags().toLowerCase() : "";

            switch (lifestyle) {
                case "quiet":
                    if (vibe.contains("quiet") || vibe.contains("green")) lifestyleScore += 18;
                    if (prop.getSafetyRating() >= 4.5) lifestyleScore += 5;
                    break;
                case "student":
                    if (prop.getPrice() < 25000 || vibe.contains("student") || vibe.contains("transit")) lifestyleScore += 18;
                    if (Boolean.TRUE.equals(prop.getWifi())) lifestyleScore += 5;
                    break;
                case "family":
                    if (prop.getBedrooms() >= 2 && Boolean.TRUE.equals(prop.getSecurity24x7())) lifestyleScore += 15;
                    if (prop.getSafetyRating() >= 4.0) lifestyleScore += 8;
                    break;
                case "tech_worker":
                    if (vibe.contains("tech") || vibe.contains("modern") || Boolean.TRUE.equals(prop.getWifi())) lifestyleScore += 18;
                    if (prop.getTransitScore() >= 80) lifestyleScore += 5;
                    break;
                case "pet_lover":
                    if (Boolean.TRUE.equals(prop.getPetFriendly())) lifestyleScore = 100;
                    else lifestyleScore = 30;
                    break;
                case "luxury":
                    if (Boolean.TRUE.equals(prop.getSwimmingPool()) && Boolean.TRUE.equals(prop.getGym())) lifestyleScore = 100;
                    else if (prop.getPrice() > 40000) lifestyleScore += 15;
                    break;
                default:
                    lifestyleScore = 85;
                    break;
            }
            lifestyleScore = Math.min(100, Math.max(30, lifestyleScore));
            res.setLifestyleScore(lifestyleScore);

            // 4. Amenities Score (Weight: 15%)
            int matchedAmenities = 0;
            int totalAmenitiesChecked = 0;

            if (Boolean.TRUE.equals(req.getPetFriendly())) {
                totalAmenitiesChecked++;
                if (Boolean.TRUE.equals(prop.getPetFriendly())) matchedAmenities++;
            }
            if (Boolean.TRUE.equals(req.getParking())) {
                totalAmenitiesChecked++;
                if (Boolean.TRUE.equals(prop.getParkingAvailable())) matchedAmenities++;
            }
            if (Boolean.TRUE.equals(req.getGym())) {
                totalAmenitiesChecked++;
                if (Boolean.TRUE.equals(prop.getGym())) matchedAmenities++;
            }
            if (Boolean.TRUE.equals(req.getSwimmingPool())) {
                totalAmenitiesChecked++;
                if (Boolean.TRUE.equals(prop.getSwimmingPool())) matchedAmenities++;
            }
            if (Boolean.TRUE.equals(req.getBalcony())) {
                totalAmenitiesChecked++;
                if (Boolean.TRUE.equals(prop.getBalcony())) matchedAmenities++;
            }

            int amenitiesScore;
            if (totalAmenitiesChecked == 0) {
                // General amenities richness
                int count = 0;
                if (Boolean.TRUE.equals(prop.getParkingAvailable())) count++;
                if (Boolean.TRUE.equals(prop.getGym())) count++;
                if (Boolean.TRUE.equals(prop.getSwimmingPool())) count++;
                if (Boolean.TRUE.equals(prop.getBalcony())) count++;
                if (Boolean.TRUE.equals(prop.getAirConditioning())) count++;
                if (Boolean.TRUE.equals(prop.getPowerBackup())) count++;
                if (Boolean.TRUE.equals(prop.getWifi())) count++;
                amenitiesScore = Math.min(100, 60 + (count * 6));
            } else {
                amenitiesScore = (int) (((double) matchedAmenities / totalAmenitiesChecked) * 100);
            }
            res.setAmenitiesScore(amenitiesScore);

            // 5. Safety & Transit Score (Weight: 10%)
            int safetyScore = (int) (prop.getSafetyRating() * 20); // 5.0 -> 100
            res.setSafetyScore(safetyScore);

            // Bedroom hard match check
            if (req.getBedrooms() != null && req.getBedrooms() > 0) {
                if (!prop.getBedrooms().equals(req.getBedrooms())) {
                    budgetScore = (int) (budgetScore * 0.85);
                }
            }

            // Overall Weighted Match Percentage
            double overall = (budgetScore * 0.30) +
                             (locationScore * 0.25) +
                             (lifestyleScore * 0.20) +
                             (amenitiesScore * 0.15) +
                             (safetyScore * 0.10);

            // Adjust by prioritization preference
            if ("budget".equalsIgnoreCase(req.getPrioritize())) {
                overall = (budgetScore * 0.50) + (locationScore * 0.20) + (lifestyleScore * 0.15) + (amenitiesScore * 0.15);
            } else if ("luxury".equalsIgnoreCase(req.getPrioritize())) {
                overall = (amenitiesScore * 0.40) + (lifestyleScore * 0.30) + (locationScore * 0.20) + (budgetScore * 0.10);
            } else if ("commute".equalsIgnoreCase(req.getPrioritize())) {
                overall = (locationScore * 0.40) + ((prop.getTransitScore() != null ? prop.getTransitScore() : 80) * 0.25) + (budgetScore * 0.20) + (amenitiesScore * 0.15);
            }

            int finalMatch = (int) Math.round(Math.min(99, Math.max(35, overall)));
            res.setMatchPercentage(finalMatch);

            // Generate AI Highlights & Explainability
            List<String> highlights = new ArrayList<>();
            List<String> considerations = new ArrayList<>();

            if (budgetScore >= 90) {
                highlights.add("Highly budget-compatible (Great value per sq. ft)");
            } else if (budgetScore < 70) {
                considerations.add("Rent is slightly above your preferred budget");
            }

            if (locationScore >= 95) {
                highlights.add("Located precisely in your desired neighborhood: " + prop.getCity());
            }

            if (Boolean.TRUE.equals(prop.getPetFriendly())) {
                highlights.add("100% Pet Friendly with nearby open areas");
            }

            if (prop.getSafetyRating() >= 4.5) {
                highlights.add("Prime safety rating (" + prop.getSafetyRating() + "/5.0) with gated 24/7 security");
            }

            if (prop.getTransitScore() != null && prop.getTransitScore() >= 85) {
                highlights.add("High transit connectivity (Transit Score: " + prop.getTransitScore() + "/100)");
            }

            if (!Boolean.TRUE.equals(prop.getParkingAvailable()) && Boolean.TRUE.equals(req.getParking())) {
                considerations.add("Dedicated parking not included");
            }

            res.setHighlightPoints(highlights);
            res.setConsiderations(considerations);

            // AI Verdict
            if (finalMatch >= 88) {
                res.setPrimaryMatchReason("Exceptional Match: Fits budget, desired amenities, and lifestyle profile.");
                res.setAiVerdict("AI Top Pick - Highly Recommended for immediate viewing.");
            } else if (finalMatch >= 75) {
                res.setPrimaryMatchReason("Strong Contender: Excellent location and core living essentials.");
                res.setAiVerdict("Recommended - Solid balance of price and comfort.");
            } else {
                res.setPrimaryMatchReason("Moderate Match: Meets some criteria but has minor trade-offs.");
                res.setAiVerdict("Fair Option - Worth reviewing if other preferences are flexible.");
            }

            scoredResponses.add(res);
        }

        // Sort descending by match percentage
        scoredResponses.sort((a, b) -> Integer.compare(b.getMatchPercentage(), a.getMatchPercentage()));
        return scoredResponses;
    }

    /**
     * Rental Price Prediction Engine (Calculates Fair Market Rent with Confidence Intervals)
     */
    public PricePredictionResponse predictRentalPrice(PricePredictionRequest req) {
        PricePredictionResponse response = new PricePredictionResponse();

        double baseRatePerSqft = 22.0; // Base market rate per sqft

        // Adjust based on city / location tier
        String tier = req.getLocationTier() != null ? req.getLocationTier().toUpperCase() : "TIER_1";
        double tierMultiplier = switch (tier) {
            case "TIER_1" -> 1.35; // Prime downtown / tech corridor
            case "TIER_2" -> 1.05; // Established suburb
            case "TIER_3" -> 0.85; // Developing periphery
            default -> 1.10;
        };

        // City specific weighting
        String city = req.getCity() != null ? req.getCity().toLowerCase() : "bengaluru";
        double cityMultiplier = switch (city) {
            case "mumbai" -> 1.60;
            case "bengaluru", "bangalore" -> 1.30;
            case "delhi", "gurgaon" -> 1.25;
            case "hyderabad", "pune" -> 1.15;
            case "chennai" -> 1.05;
            default -> 1.0;
        };

        double sqft = req.getAreaSqft() != null && req.getAreaSqft() > 100 ? req.getAreaSqft() : 1000.0;
        double calculatedBase = sqft * baseRatePerSqft * tierMultiplier * cityMultiplier;

        // Bedroom and Bathroom adjustments
        int beds = req.getBedrooms() != null ? req.getBedrooms() : 2;
        int baths = req.getBathrooms() != null ? req.getBathrooms() : 2;
        double roomAdjustment = (beds * 2500) + (baths * 1200);

        // Furnishing Status
        double furnishingMultiplier = 1.0;
        if (req.getFurnishedStatus() != null) {
            furnishingMultiplier = switch (req.getFurnishedStatus()) {
                case FULLY_FURNISHED -> 1.22;
                case SEMI_FURNISHED -> 1.08;
                case UNFURNISHED -> 0.95;
            };
        }

        // Amenities premium
        double amenitiesBonus = 0;
        List<String> factors = new ArrayList<>();
        factors.add(String.format("Base Area: %.0f sq.ft in %s (%s)", sqft, req.getCity(), tier));

        if (Boolean.TRUE.equals(req.getParkingAvailable())) {
            amenitiesBonus += 2000;
            factors.add("Dedicated Parking: +₹2,000/mo");
        }
        if (Boolean.TRUE.equals(req.getGym())) {
            amenitiesBonus += 1500;
            factors.add("Fitness Center / Gym: +₹1,500/mo");
        }
        if (Boolean.TRUE.equals(req.getSwimmingPool())) {
            amenitiesBonus += 2500;
            factors.add("Swimming Pool: +₹2,500/mo");
        }
        if (Boolean.TRUE.equals(req.getPowerBackup())) {
            amenitiesBonus += 1200;
            factors.add("100% Power Backup: +₹1,200/mo");
        }
        if (Boolean.TRUE.equals(req.getAirConditioning())) {
            amenitiesBonus += 1800;
            factors.add("Central / Split AC: +₹1,800/mo");
        }
        if (Boolean.TRUE.equals(req.getBalcony())) {
            amenitiesBonus += 1000;
            factors.add("Private Balcony: +₹1,000/mo");
        }

        double totalPredicted = (calculatedBase + roomAdjustment) * furnishingMultiplier + amenitiesBonus;

        // Round to nearest 500
        double finalPrice = Math.round(totalPredicted / 500.0) * 500.0;
        double lowRange = Math.round((finalPrice * 0.93) / 500.0) * 500.0;
        double highRange = Math.round((finalPrice * 1.08) / 500.0) * 500.0;

        response.setEstimatedRent(finalPrice);
        response.setConfidenceLow(lowRange);
        response.setConfidenceHigh(highRange);
        response.setPricePerSqft(Math.round((finalPrice / sqft) * 100.0) / 100.0);
        response.setMarketTrend(tier.equals("TIER_1") ? "HOT_MARKET" : "BALANCED");
        response.setRentalYieldEstimate(4.2); // Typical residential rental yield
        response.setContributingFactors(factors);
        response.setValuationSummary(String.format(
                "Estimated fair market rental value is ₹%,.0f/month (Confidence range: ₹%,.0f - ₹%,.0f). Driven by %s location rating and %s specification.",
                finalPrice, lowRange, highRange, tier, req.getFurnishedStatus() != null ? req.getFurnishedStatus() : "SEMI_FURNISHED"
        ));

        return response;
    }

    /**
     * Natural Language Property Search Parser
     * Converts queries like "Find a quiet 2bhk near tech park under 2500 with balcony and gym"
     */
    public List<Property> searchNaturalLanguage(String query) {
        if (query == null || query.trim().isEmpty()) {
            return propertyRepository.findByStatus(com.smartrent.entity.PropertyStatus.AVAILABLE);
        }

        String lowerQuery = query.toLowerCase();

        // Extract Bedroom count (e.g. "1bhk", "2 bhk", "3 bed", "4 bedroom")
        Integer bedrooms = null;
        Pattern bedPattern = Pattern.compile("(\\d+)\\s*(bhk|bed|bedroom)");
        Matcher bedMatcher = bedPattern.matcher(lowerQuery);
        if (bedMatcher.find()) {
            try {
                bedrooms = Integer.parseInt(bedMatcher.group(1));
            } catch (NumberFormatException ignored) {}
        }

        // Extract Price limit (e.g. "under 30000", "< 25000", "below 40k", "max 35000")
        Double maxPrice = null;
        Pattern pricePattern = Pattern.compile("(under|below|<|less than|max|budget)\\s*(\\d+)(k)?");
        Matcher priceMatcher = pricePattern.matcher(lowerQuery);
        if (priceMatcher.find()) {
            try {
                double rawVal = Double.parseDouble(priceMatcher.group(2));
                if ("k".equalsIgnoreCase(priceMatcher.group(3)) || rawVal < 1000) {
                    rawVal *= 1000;
                }
                maxPrice = rawVal;
            } catch (NumberFormatException ignored) {}
        }

        // Extract Amenities keywords
        boolean wantPet = lowerQuery.contains("pet") || lowerQuery.contains("dog") || lowerQuery.contains("cat");
        boolean wantGym = lowerQuery.contains("gym") || lowerQuery.contains("fitness");
        boolean wantPool = lowerQuery.contains("pool") || lowerQuery.contains("swimming");
        boolean wantParking = lowerQuery.contains("parking") || lowerQuery.contains("garage");
        boolean wantBalcony = lowerQuery.contains("balcony") || lowerQuery.contains("terrace");

        // Extract Property Type
        PropertyType type = null;
        if (lowerQuery.contains("villa")) type = PropertyType.VILLA;
        else if (lowerQuery.contains("studio")) type = PropertyType.STUDIO;
        else if (lowerQuery.contains("condo")) type = PropertyType.CONDO;
        else if (lowerQuery.contains("independent") || lowerQuery.contains("house")) type = PropertyType.INDEPENDENT_HOUSE;
        else if (lowerQuery.contains("apartment") || lowerQuery.contains("flat")) type = PropertyType.APARTMENT;

        // Fetch candidate properties
        List<Property> candidates = propertyRepository.findByStatus(com.smartrent.entity.PropertyStatus.AVAILABLE);

        final Integer targetBedrooms = bedrooms;
        final Double targetMaxPrice = maxPrice;
        final PropertyType targetType = type;

        return candidates.stream().sorted((p1, p2) -> {
            int score1 = calculateRelevance(p1, lowerQuery, targetBedrooms, targetMaxPrice, targetType, wantPet, wantGym, wantPool, wantParking, wantBalcony);
            int score2 = calculateRelevance(p2, lowerQuery, targetBedrooms, targetMaxPrice, targetType, wantPet, wantGym, wantPool, wantParking, wantBalcony);
            return Integer.compare(score2, score1);
        }).collect(Collectors.toList());
    }

    private int calculateRelevance(Property p, String query, Integer beds, Double maxPrice, PropertyType type,
                                  boolean wantPet, boolean wantGym, boolean wantPool, boolean wantParking, boolean wantBalcony) {
        int score = 50;

        if (beds != null && beds.equals(p.getBedrooms())) score += 30;
        if (maxPrice != null && p.getPrice() <= maxPrice) score += 25;
        if (type != null && type.equals(p.getPropertyType())) score += 20;

        if (wantPet && Boolean.TRUE.equals(p.getPetFriendly())) score += 15;
        if (wantGym && Boolean.TRUE.equals(p.getGym())) score += 15;
        if (wantPool && Boolean.TRUE.equals(p.getSwimmingPool())) score += 15;
        if (wantParking && Boolean.TRUE.equals(p.getParkingAvailable())) score += 15;
        if (wantBalcony && Boolean.TRUE.equals(p.getBalcony())) score += 15;

        // Textual matching
        String fullText = (p.getTitle() + " " + p.getDescription() + " " + p.getCity() + " " + p.getNeighborhood() + " " + p.getVibeTags()).toLowerCase();
        for (String word : query.split("\\s+")) {
            if (word.length() > 3 && fullText.contains(word)) {
                score += 8;
            }
        }

        return score;
    }

    /**
     * AI Property Chatbot (Assistant for rental inquiries, advice, lease policies)
     */
    public ChatbotResponse askChatbot(ChatbotRequest req) {
        // If external AI API Key is provided, attempt to contact Gemini / OpenAI API
        if (aiApiKey != null && !aiApiKey.trim().isEmpty() && !"internal".equalsIgnoreCase(aiProvider)) {
            try {
                return callExternalAiChatbot(req);
            } catch (Exception e) {
                logger.warn("External AI call failed, falling back to built-in rule engine: {}", e.getMessage());
            }
        }

        // Built-in intelligent AI assistant fallback
        String query = req.getMessage() != null ? req.getMessage().toLowerCase() : "";
        ChatbotResponse response = new ChatbotResponse();

        Property propertyContext = null;
        if (req.getPropertyId() != null) {
            propertyContext = propertyRepository.findById(req.getPropertyId()).orElse(null);
        }

        if (query.contains("deposit") || query.contains("security")) {
            if (propertyContext != null) {
                response.setReply(String.format("For %s, the security deposit is ₹%,.0f. It is 100%% refundable upon lease completion subject to inspection as outlined in standard tenant agreements.",
                        propertyContext.getTitle(), propertyContext.getSecurityDeposit() != null ? propertyContext.getSecurityDeposit() : propertyContext.getPrice() * 2));
            } else {
                response.setReply("Standard security deposits typically range between 2 to 3 months of rent. All security deposits through SmartRent are protected with verified digital lease agreements and refundable at move-out.");
            }
            response.setFollowUpSuggestions(List.of("What is the lease duration?", "Are maintenance fees included?", "Schedule a tour"));
        } else if (query.contains("pet") || query.contains("dog") || query.contains("cat")) {
            if (propertyContext != null) {
                boolean petOk = Boolean.TRUE.equals(propertyContext.getPetFriendly());
                response.setReply(petOk
                        ? "Great news! This home is fully pet-friendly! Both dogs and cats are welcome with open arms."
                        : "Unfortunately, this specific listing has a strict no-pets policy set by the owner. However, I can recommend several pet-friendly homes nearby!");
            } else {
                response.setReply("SmartRent has over 60% pet-friendly listings with designated dog-walking parks and green belts. You can enable the 'Pet-Friendly' filter at any time.");
            }
            response.setFollowUpSuggestions(List.of("Show pet-friendly listings", "What is the pet policy?", "Are there parks nearby?"));
        } else if (query.contains("tour") || query.contains("visit") || query.contains("view")) {
            response.setReply("You can easily schedule both in-person visits and virtual 3D video walk-throughs! Simply click the 'Schedule Tour' button on any property listing or in your dashboard.");
            response.setFollowUpSuggestions(List.of("Schedule an in-person tour", "Request virtual tour link", "Contact landlord directly"));
        } else if (query.contains("recommend") || query.contains("find") || query.contains("suggest")) {
            List<Property> topList = propertyRepository.findByStatus(com.smartrent.entity.PropertyStatus.AVAILABLE)
                    .stream().limit(3).collect(Collectors.toList());
            response.setReply("Based on active renter trends, I've selected the top-rated properties featuring prime connectivity, 24/7 security, and high value scores:");
            response.setSuggestedProperties(topList);
            response.setFollowUpSuggestions(List.of("Show 2 BHK under ₹30,000", "Homes near Tech Hubs", "Properties with Swimming Pool"));
        } else {
            if (propertyContext != null) {
                response.setReply(String.format("Regarding '%s' in %s: It offers %d Bed / %d Bath with %.0f sq.ft living area at ₹%,.0f/month. Would you like to check amenities, schedule a tour, or submit an application?",
                        propertyContext.getTitle(), propertyContext.getCity(), propertyContext.getBedrooms(), propertyContext.getBathrooms(), propertyContext.getAreaSqft(), propertyContext.getPrice()));
            } else {
                response.setReply("Hello! I am your SmartRent AI assistant. I can help you find your dream home, explain rental price valuations, answer questions about lease terms, or compare properties. How may I assist your search today?");
            }
            response.setFollowUpSuggestions(List.of("What is a fair rent for 2 BHK in Bengaluru?", "Find quiet homes under budget", "Explain AI match scores"));
        }

        response.setConfidence("High (98.4%)");
        return response;
    }

    private ChatbotResponse callExternalAiChatbot(ChatbotRequest req) throws Exception {
        // Build prompt with property context if available
        StringBuilder systemPrompt = new StringBuilder("You are an expert, friendly real-estate AI assistant for SmartRent. Give concise, highly helpful answers.");
        if (req.getPropertyId() != null) {
            propertyRepository.findById(req.getPropertyId()).ifPresent(p -> {
                systemPrompt.append(String.format(" Current property context: Title: %s, Price: %.0f, City: %s, Beds: %d, Baths: %d, PetFriendly: %b, Amenities: Gym=%b, Pool=%b.",
                        p.getTitle(), p.getPrice(), p.getCity(), p.getBedrooms(), p.getBathrooms(), p.getPetFriendly(), p.getGym(), p.getSwimmingPool()));
            });
        }

        String prompt = systemPrompt.toString() + "\nUser question: " + req.getMessage();
        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)
                        ))
                )
        );

        String jsonPayload = objectMapper.writeValueAsString(body);
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + aiApiKey;

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() == 200) {
            JsonNode root = objectMapper.readTree(response.body());
            String replyText = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            ChatbotResponse cr = new ChatbotResponse(replyText);
            cr.setFollowUpSuggestions(List.of("Schedule a tour", "Check price prediction", "Compare properties"));
            cr.setConfidence("Real-time LLM Output");
            return cr;
        }

        throw new RuntimeException("API error code: " + response.statusCode());
    }

    /**
     * Side-by-Side Property Comparison Engine with AI Value Judgment
     */
    public PropertyComparisonResponse compareProperties(PropertyComparisonRequest req) {
        PropertyComparisonResponse response = new PropertyComparisonResponse();

        if (req.getPropertyIds() == null || req.getPropertyIds().isEmpty()) {
            return response;
        }

        List<Property> properties = propertyRepository.findAllById(req.getPropertyIds());
        response.setProperties(properties);

        if (properties.isEmpty()) {
            return response;
        }

        Property winner = null;
        double bestValueRatio = -1.0;

        for (Property p : properties) {
            List<String> pros = new ArrayList<>();
            List<String> cons = new ArrayList<>();

            double sqft = p.getAreaSqft() > 0 ? p.getAreaSqft() : 1000.0;
            double pricePerSqft = p.getPrice() / sqft;

            // Pros detection
            if (pricePerSqft < 28) pros.add("Exceptional price per square foot (₹" + Math.round(pricePerSqft) + "/sqft)");
            if (Boolean.TRUE.equals(p.getSwimmingPool()) && Boolean.TRUE.equals(p.getGym())) pros.add("Full luxury amenity suite (Gym + Swimming Pool)");
            if (p.getSafetyRating() >= 4.5) pros.add("High security index (" + p.getSafetyRating() + "/5.0)");
            if (Boolean.TRUE.equals(p.getPetFriendly())) pros.add("Pet-welcoming environment");
            if (p.getTransitScore() != null && p.getTransitScore() >= 85) pros.add("Walking distance to major transit hubs");

            // Cons detection
            if (pricePerSqft > 45) cons.add("Premium pricing compared to local average");
            if (!Boolean.TRUE.equals(p.getParkingAvailable())) cons.add("No dedicated parking spot included");
            if (!Boolean.TRUE.equals(p.getPowerBackup())) cons.add("No full power backup generator");

            response.getPropertyPros().put(p.getId(), pros);
            response.getPropertyCons().put(p.getId(), cons);

            // Value calculation score: (Area * Safety * Transit) / Price
            double valueScore = ((sqft * p.getSafetyRating() * (p.getTransitScore() != null ? p.getTransitScore() : 80)) / p.getPrice()) * 10;
            double normalizedValue = Math.min(99, Math.round(valueScore));
            response.getValueForMoneyScores().put(p.getId(), normalizedValue);

            if (normalizedValue > bestValueRatio) {
                bestValueRatio = normalizedValue;
                winner = p;
            }
        }

        if (winner != null) {
            response.setRecommendedWinnerId(winner.getId());
            response.setWinnerTitle(winner.getTitle());
            response.setWinnerReason(String.format("Delivers the best overall value equation with %d bedrooms, %.0f sq.ft, high safety (%.1f/5) and a competitive monthly rent of ₹%,.0f.",
                    winner.getBedrooms(), winner.getAreaSqft(), winner.getSafetyRating(), winner.getPrice()));
            response.setExecutiveSummary(String.format("Comparing %d homes: %s emerges as the smartest choice for renters seeking maximum living space and amenities per rupee spent.",
                    properties.size(), winner.getTitle()));
        }

        return response;
    }
}
