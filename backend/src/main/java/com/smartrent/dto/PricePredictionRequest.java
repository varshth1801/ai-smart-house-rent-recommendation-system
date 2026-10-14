package com.smartrent.dto;

import com.smartrent.entity.FurnishedStatus;
import com.smartrent.entity.PropertyType;

public class PricePredictionRequest {
    private String city = "Bengaluru";
    private Integer bedrooms = 2;
    private Integer bathrooms = 2;
    private Double areaSqft = 1100.0;
    private PropertyType propertyType = PropertyType.APARTMENT;
    private FurnishedStatus furnishedStatus = FurnishedStatus.SEMI_FURNISHED;
    private String locationTier = "TIER_1"; // TIER_1, TIER_2, TIER_3
    private Boolean parkingAvailable = true;
    private Boolean gym = true;
    private Boolean swimmingPool = false;
    private Boolean petFriendly = true;
    private Boolean balcony = true;
    private Boolean airConditioning = true;
    private Boolean powerBackup = true;

    public PricePredictionRequest() {}

    // Getters and Setters
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Integer getBedrooms() { return bedrooms; }
    public void setBedrooms(Integer bedrooms) { this.bedrooms = bedrooms; }

    public Integer getBathrooms() { return bathrooms; }
    public void setBathrooms(Integer bathrooms) { this.bathrooms = bathrooms; }

    public Double getAreaSqft() { return areaSqft; }
    public void setAreaSqft(Double areaSqft) { this.areaSqft = areaSqft; }

    public PropertyType getPropertyType() { return propertyType; }
    public void setPropertyType(PropertyType propertyType) { this.propertyType = propertyType; }

    public FurnishedStatus getFurnishedStatus() { return furnishedStatus; }
    public void setFurnishedStatus(FurnishedStatus furnishedStatus) { this.furnishedStatus = furnishedStatus; }

    public String getLocationTier() { return locationTier; }
    public void setLocationTier(String locationTier) { this.locationTier = locationTier; }

    public Boolean getParkingAvailable() { return parkingAvailable; }
    public void setParkingAvailable(Boolean parkingAvailable) { this.parkingAvailable = parkingAvailable; }

    public Boolean getGym() { return gym; }
    public void setGym(Boolean gym) { this.gym = gym; }

    public Boolean getSwimmingPool() { return swimmingPool; }
    public void setSwimmingPool(Boolean swimmingPool) { this.swimmingPool = swimmingPool; }

    public Boolean getPetFriendly() { return petFriendly; }
    public void setPetFriendly(Boolean petFriendly) { this.petFriendly = petFriendly; }

    public Boolean getBalcony() { return balcony; }
    public void setBalcony(Boolean balcony) { this.balcony = balcony; }

    public Boolean getAirConditioning() { return airConditioning; }
    public void setAirConditioning(Boolean airConditioning) { this.airConditioning = airConditioning; }

    public Boolean getPowerBackup() { return powerBackup; }
    public void setPowerBackup(Boolean powerBackup) { this.powerBackup = powerBackup; }
}
