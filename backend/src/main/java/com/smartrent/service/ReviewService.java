package com.smartrent.service;

import com.smartrent.entity.Property;
import com.smartrent.entity.Review;
import com.smartrent.entity.User;
import com.smartrent.exception.ResourceNotFoundException;
import com.smartrent.repository.PropertyRepository;
import com.smartrent.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final PropertyRepository propertyRepository;
    private final UserService userService;

    public ReviewService(ReviewRepository reviewRepository,
                         PropertyRepository propertyRepository,
                         UserService userService) {
        this.reviewRepository = reviewRepository;
        this.propertyRepository = propertyRepository;
        this.userService = userService;
    }

    public List<Review> getReviewsForProperty(Long propertyId) {
        return reviewRepository.findByPropertyIdOrderByCreatedAtDesc(propertyId);
    }

    @Transactional
    public Review addReview(Long propertyId, Integer rating, String comment) {
        User user = userService.getCurrentAuthenticatedUser();
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));

        Review review = new Review(property, user, rating, comment);
        Review saved = reviewRepository.save(review);

        // Update property safety/community rating average
        Double avg = reviewRepository.getAverageRatingForProperty(propertyId);
        if (avg != null) {
            property.setSafetyRating(Math.round(avg * 10.0) / 10.0);
            propertyRepository.save(property);
        }

        return saved;
    }
}
