package com.smartrent.dto;

public class AiRecommendationRequest {
    private String city;
    private Double maxBudget;
    private Integer bedrooms;
    private String lifestyle; // "quiet", "student", "family", "tech_worker", "pet_lover", "luxury"
    private Boolean petFriendly;
    private Boolean parking;
    private Boolean gym;
    private Boolean swimmingPool;
    private Boolean balcony;
    private String prioritize; // "budget", "lifestyle", "commute", "luxury", "balanced"

    public AiRecommendationRequest() {}

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Double getMaxBudget() { return maxBudget; }
    public void setMaxBudget(Double maxBudget) { this.maxBudget = maxBudget; }

    public Integer getBedrooms() { return bedrooms; }
    public void setBedrooms(Integer bedrooms) { this.bedrooms = bedrooms; }

    public String getLifestyle() { return lifestyle; }
    public void setLifestyle(String lifestyle) { this.lifestyle = lifestyle; }

    public Boolean getPetFriendly() { return petFriendly; }
    public void setPetFriendly(Boolean petFriendly) { this.petFriendly = petFriendly; }

    public Boolean getParking() { return parking; }
    public void setParking(Boolean parking) { this.parking = parking; }

    public Boolean getGym() { return gym; }
    public void setGym(Boolean gym) { this.gym = gym; }

    public Boolean getSwimmingPool() { return swimmingPool; }
    public void setSwimmingPool(Boolean swimmingPool) { this.swimmingPool = swimmingPool; }

    public Boolean getBalcony() { return balcony; }
    public void setBalcony(Boolean balcony) { this.balcony = balcony; }

    public String getPrioritize() { return prioritize; }
    public void setPrioritize(String prioritize) { this.prioritize = prioritize; }
}
