package com.smartrent.controller;

import com.smartrent.dto.PropertyCreateRequest;
import com.smartrent.entity.Property;
import com.smartrent.entity.PropertyType;
import com.smartrent.entity.Review;
import com.smartrent.service.PropertyService;
import com.smartrent.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;
    private final ReviewService reviewService;

    public PropertyController(PropertyService propertyService, ReviewService reviewService) {
        this.propertyService = propertyService;
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<List<Property>> searchProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Integer bedrooms,
            @RequestParam(required = false) PropertyType propertyType,
            @RequestParam(required = false) Boolean petFriendly,
            @RequestParam(required = false) Boolean parkingAvailable,
            @RequestParam(required = false) Boolean gym) {

        List<Property> properties = propertyService.searchProperties(
                city, minPrice, maxPrice, bedrooms, propertyType, petFriendly, parkingAvailable, gym);
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Property> getPropertyById(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getPropertyById(id));
    }

    @GetMapping("/cities")
    public ResponseEntity<List<String>> getDistinctCities() {
        return ResponseEntity.ok(propertyService.getDistinctCities());
    }

    @GetMapping("/landlord/{landlordId}")
    public ResponseEntity<List<Property>> getPropertiesByLandlord(@PathVariable Long landlordId) {
        return ResponseEntity.ok(propertyService.getPropertiesByLandlord(landlordId));
    }

    @PostMapping
    public ResponseEntity<Property> createProperty(@Valid @RequestBody PropertyCreateRequest request) {
        Property created = propertyService.createProperty(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Property> updateProperty(@PathVariable Long id,
                                                  @Valid @RequestBody PropertyCreateRequest request) {
        return ResponseEntity.ok(propertyService.updateProperty(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.ok(Map.of("message", "Property listing removed successfully."));
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<Review>> getReviews(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getReviewsForProperty(id));
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<Review> addReview(@PathVariable Long id,
                                            @RequestBody Map<String, Object> body) {
        Integer rating = (Integer) body.getOrDefault("rating", 5);
        String comment = (String) body.getOrDefault("comment", "");
        return ResponseEntity.ok(reviewService.addReview(id, rating, comment));
    }
}
