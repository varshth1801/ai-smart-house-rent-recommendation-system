package com.smartrent.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "properties")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    @NotBlank
    @Column(nullable = false)
    private String address;

    @NotBlank
    @Column(nullable = false)
    private String city;

    private String state;
    private String zipCode;
    private String neighborhood;

    @NotNull
    @Column(nullable = false)
    private Double price; // Monthly Rent

    private Double securityDeposit;
    private Double maintenanceFee;

    @NotNull
    @Column(nullable = false)
    private Integer bedrooms;

    @NotNull
    @Column(nullable = false)
    private Integer bathrooms;

    @NotNull
    @Column(nullable = false)
    private Double areaSqft;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PropertyType propertyType = PropertyType.APARTMENT;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FurnishedStatus furnishedStatus = FurnishedStatus.SEMI_FURNISHED;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PropertyStatus status = PropertyStatus.AVAILABLE;

    private LocalDate availableFrom = LocalDate.now();

    // Amenities
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

    // AI & Geospatial Metrics
    private Double latitude;
    private Double longitude;
    private String locationTier = "TIER_1"; // TIER_1 (Prime), TIER_2 (Suburban), TIER_3 (Outer)
    private Double safetyRating = 4.5;      // 1.0 to 5.0
    private Integer transitScore = 85;      // 0 to 100
    private String vibeTags = "Quiet,Modern,Green,Tech-Hub"; // Comma-separated

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "property_images", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "landlord_id", nullable = false)
    @JsonIgnoreProperties({"password", "preferredCity", "maxBudget", "preferredBedrooms"})
    private User landlord;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public Property() {
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public PropertyStatus getStatus() { return status; }
    public void setStatus(PropertyStatus status) { this.status = status; }

    public LocalDate getAvailableFrom() { return availableFrom; }
    public void setAvailableFrom(LocalDate availableFrom) { this.availableFrom = availableFrom; }

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

    public User getLandlord() { return landlord; }
    public void setLandlord(User landlord) { this.landlord = landlord; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
