package com.smartrent.dto;

import com.smartrent.entity.FurnishedStatus;
import com.smartrent.entity.PropertyType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class PropertyCreateRequest {
    @NotBlank
    private String title;

    private String description;

    @NotBlank
    private String address;

    @NotBlank
    private String city;

    private String state;
    private String zipCode;
    private String neighborhood;

    @NotNull
    private Double price;

    private Double securityDeposit;
    private Double maintenanceFee;

    @NotNull
    private Integer bedrooms;

    @NotNull
    private Integer bathrooms;

    @NotNull
    private Double areaSqft;

    private PropertyType propertyType = PropertyType.APARTMENT;
    private FurnishedStatus furnishedStatus = FurnishedStatus.SEMI_FURNISHED;

    private Boolean petFriendly = false;
    private Boolean parkingAvailable = false;
    private Boolean gym = false;
    private Boolean swimmingPool = false;
    private Boolean powerBackup = false;
    private Boolean balcony = false;
    private Boolean airConditioning = false;
    private Boolean wifi = false;
    private Boolean elevator = false;
    private Boolean security24x7 = false;

    private Double latitude;
    private Double longitude;
    private String locationTier = "TIER_1";
    private Double safetyRating = 4.5;
    private Integer transitScore = 80;
    private String vibeTags = "Quiet,Modern";

    private List<String> imageUrls;

    public PropertyCreateRequest() {}

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }

    public String getNeighborhood() { return neighborhood; }
    public void setNeighborhood(String neighborhood) { this.neighborhood = neighborhood; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Double getSecurityDeposit() { return securityDeposit; }
    public void setSecurityDeposit(Double securityDeposit) { this.securityDeposit = securityDeposit; }

    public Double getMaintenanceFee() { return maintenanceFee; }
    public void setMaintenanceFee(Double maintenanceFee) { this.maintenanceFee = maintenanceFee; }

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

    public Boolean getPetFriendly() { return petFriendly; }
    public void setPetFriendly(Boolean petFriendly) { this.petFriendly = petFriendly; }

    public Boolean getParkingAvailable() { return parkingAvailable; }
    public void setParkingAvailable(Boolean parkingAvailable) { this.parkingAvailable = parkingAvailable; }

    public Boolean getGym() { return gym; }
    public void setGym(Boolean gym) { this.gym = gym; }

    public Boolean getSwimmingPool() { return swimmingPool; }
    public void setSwimmingPool(Boolean swimmingPool) { this.swimmingPool = swimmingPool; }

    public Boolean getPowerBackup() { return powerBackup; }
    public void setPowerBackup(Boolean powerBackup) { this.powerBackup = powerBackup; }

    public Boolean getBalcony() { return balcony; }
    public void setBalcony(Boolean balcony) { this.balcony = balcony; }

    public Boolean getAirConditioning() { return airConditioning; }
    public void setAirConditioning(Boolean airConditioning) { this.airConditioning = airConditioning; }

    public Boolean getWifi() { return wifi; }
    public void setWifi(Boolean wifi) { this.wifi = wifi; }

    public Boolean getElevator() { return elevator; }
    public void setElevator(Boolean elevator) { this.elevator = elevator; }

    public Boolean getSecurity24x7() { return security24x7; }
    public void setSecurity24x7(Boolean security24x7) { this.security24x7 = security24x7; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getLocationTier() { return locationTier; }
    public void setLocationTier(String locationTier) { this.locationTier = locationTier; }

    public Double getSafetyRating() { return safetyRating; }
    public void setSafetyRating(Double safetyRating) { this.safetyRating = safetyRating; }

    public Integer getTransitScore() { return transitScore; }
    public void setTransitScore(Integer transitScore) { this.transitScore = transitScore; }

    public String getVibeTags() { return vibeTags; }
    public void setVibeTags(String vibeTags) { this.vibeTags = vibeTags; }

    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
}
