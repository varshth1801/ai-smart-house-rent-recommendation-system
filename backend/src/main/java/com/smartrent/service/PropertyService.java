package com.smartrent.service;

import com.smartrent.dto.PropertyCreateRequest;
import com.smartrent.entity.Property;
import com.smartrent.entity.PropertyStatus;
import com.smartrent.entity.PropertyType;
import com.smartrent.entity.User;
import com.smartrent.exception.BadRequestException;
import com.smartrent.exception.ResourceNotFoundException;
import com.smartrent.repository.PropertyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserService userService;

    public PropertyService(PropertyRepository propertyRepository, UserService userService) {
        this.propertyRepository = propertyRepository;
        this.userService = userService;
    }

    public List<Property> searchProperties(String city, Double minPrice, Double maxPrice,
                                           Integer bedrooms, PropertyType propertyType,
                                           Boolean petFriendly, Boolean parkingAvailable, Boolean gym) {
        return propertyRepository.searchProperties(city, minPrice, maxPrice, bedrooms, propertyType, petFriendly, parkingAvailable, gym);
    }

    public List<Property> getAllAvailableProperties() {
        return propertyRepository.findByStatus(PropertyStatus.AVAILABLE);
    }

    public Property getPropertyById(Long id) {
        return propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));
    }

    public List<Property> getPropertiesByLandlord(Long landlordId) {
        return propertyRepository.findByLandlordId(landlordId);
    }

    public List<String> getDistinctCities() {
        return propertyRepository.findDistinctCities();
    }

    @Transactional
    public Property createProperty(PropertyCreateRequest req) {
        User landlord = userService.getCurrentAuthenticatedUser();

        Property property = new Property();
        property.setTitle(req.getTitle());
        property.setDescription(req.getDescription());
        property.setAddress(req.getAddress());
        property.setCity(req.getCity());
        property.setState(req.getState());
        property.setZipCode(req.getZipCode());
        property.setNeighborhood(req.getNeighborhood());
        property.setPrice(req.getPrice());
        property.setSecurityDeposit(req.getSecurityDeposit() != null ? req.getSecurityDeposit() : req.getPrice() * 2);
        property.setMaintenanceFee(req.getMaintenanceFee() != null ? req.getMaintenanceFee() : 0.0);
        property.setBedrooms(req.getBedrooms());
        property.setBathrooms(req.getBathrooms());
        property.setAreaSqft(req.getAreaSqft());
        property.setPropertyType(req.getPropertyType());
        property.setFurnishedStatus(req.getFurnishedStatus());
        property.setStatus(PropertyStatus.AVAILABLE);

        property.setPetFriendly(req.getPetFriendly());
        property.setParkingAvailable(req.getParkingAvailable());
        property.setGym(req.getGym());
        property.setSwimmingPool(req.getSwimmingPool());
        property.setPowerBackup(req.getPowerBackup());
        property.setBalcony(req.getBalcony());
        property.setAirConditioning(req.getAirConditioning());
        property.setWifi(req.getWifi());
        property.setElevator(req.getElevator());
        property.setSecurity24x7(req.getSecurity24x7());

        property.setLatitude(req.getLatitude());
        property.setLongitude(req.getLongitude());
        property.setLocationTier(req.getLocationTier() != null ? req.getLocationTier() : "TIER_1");
        property.setSafetyRating(req.getSafetyRating() != null ? req.getSafetyRating() : 4.5);
        property.setTransitScore(req.getTransitScore() != null ? req.getTransitScore() : 80);
        property.setVibeTags(req.getVibeTags() != null ? req.getVibeTags() : "Modern,Quiet");

        if (req.getImageUrls() != null && !req.getImageUrls().isEmpty()) {
            property.setImageUrls(req.getImageUrls());
        } else {
            property.setImageUrls(List.of("https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80"));
        }

        property.setLandlord(landlord);
        return propertyRepository.save(property);
    }

    @Transactional
    public Property updateProperty(Long id, PropertyCreateRequest req) {
        Property property = getPropertyById(id);
        User current = userService.getCurrentAuthenticatedUser();

        if (!property.getLandlord().getId().equals(current.getId()) && !current.getRole().name().equals("ROLE_ADMIN")) {
            throw new BadRequestException("You are not authorized to update this property listing.");
        }

        property.setTitle(req.getTitle());
        property.setDescription(req.getDescription());
        property.setAddress(req.getAddress());
        property.setCity(req.getCity());
        property.setState(req.getState());
        property.setZipCode(req.getZipCode());
        property.setNeighborhood(req.getNeighborhood());
        property.setPrice(req.getPrice());
        property.setBedrooms(req.getBedrooms());
        property.setBathrooms(req.getBathrooms());
        property.setAreaSqft(req.getAreaSqft());
        property.setPropertyType(req.getPropertyType());
        property.setFurnishedStatus(req.getFurnishedStatus());
        property.setPetFriendly(req.getPetFriendly());
        property.setParkingAvailable(req.getParkingAvailable());
        property.setGym(req.getGym());
        property.setSwimmingPool(req.getSwimmingPool());
        property.setBalcony(req.getBalcony());

        if (req.getImageUrls() != null && !req.getImageUrls().isEmpty()) {
            property.setImageUrls(req.getImageUrls());
        }

        return propertyRepository.save(property);
    }

    @Transactional
    public void deleteProperty(Long id) {
        Property property = getPropertyById(id);
        User current = userService.getCurrentAuthenticatedUser();

        if (!property.getLandlord().getId().equals(current.getId()) && !current.getRole().name().equals("ROLE_ADMIN")) {
            throw new BadRequestException("You are not authorized to delete this property listing.");
        }

        propertyRepository.delete(property);
    }
}
