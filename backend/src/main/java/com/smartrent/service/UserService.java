package com.smartrent.service;

import com.smartrent.dto.UserDTO;
import com.smartrent.entity.Property;
import com.smartrent.entity.SavedProperty;
import com.smartrent.entity.User;
import com.smartrent.exception.ResourceNotFoundException;
import com.smartrent.repository.PropertyRepository;
import com.smartrent.repository.SavedPropertyRepository;
import com.smartrent.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final SavedPropertyRepository savedPropertyRepository;
    private final PropertyRepository propertyRepository;

    public UserService(UserRepository userRepository,
                       SavedPropertyRepository savedPropertyRepository,
                       PropertyRepository propertyRepository) {
        this.userRepository = userRepository;
        this.savedPropertyRepository = savedPropertyRepository;
        this.propertyRepository = propertyRepository;
    }

    public User getCurrentAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public UserDTO getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return new UserDTO(user);
    }

    @Transactional
    public UserDTO updateProfile(Long userId, UserDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (dto.getFullName() != null) user.setFullName(dto.getFullName());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        if (dto.getAvatarUrl() != null) user.setAvatarUrl(dto.getAvatarUrl());
        if (dto.getPreferredCity() != null) user.setPreferredCity(dto.getPreferredCity());
        if (dto.getMaxBudget() != null) user.setMaxBudget(dto.getMaxBudget());
        if (dto.getPreferredBedrooms() != null) user.setPreferredBedrooms(dto.getPreferredBedrooms());
        if (dto.getPreferredLifestyle() != null) user.setPreferredLifestyle(dto.getPreferredLifestyle());
        if (dto.getPetFriendlyNeeded() != null) user.setPetFriendlyNeeded(dto.getPetFriendlyNeeded());
        if (dto.getParkingNeeded() != null) user.setParkingNeeded(dto.getParkingNeeded());
        if (dto.getGymNeeded() != null) user.setGymNeeded(dto.getGymNeeded());

        return new UserDTO(userRepository.save(user));
    }

    public List<Property> getFavoriteProperties(Long userId) {
        return savedPropertyRepository.findByUserIdOrderBySavedAtDesc(userId)
                .stream().map(SavedProperty::getProperty)
                .collect(Collectors.toList());
    }

    @Transactional
    public void toggleFavorite(Long userId, Long propertyId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + propertyId));

        if (savedPropertyRepository.existsByUserIdAndPropertyId(userId, propertyId)) {
            savedPropertyRepository.deleteByUserIdAndPropertyId(userId, propertyId);
        } else {
            savedPropertyRepository.save(new SavedProperty(user, property));
        }
    }
}
