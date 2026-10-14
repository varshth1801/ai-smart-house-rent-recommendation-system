package com.smartrent.dto;

import com.smartrent.entity.Role;
import com.smartrent.entity.User;
import java.time.LocalDateTime;

public class UserDTO {
    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private Role role;
    private String avatarUrl;
    private String preferredCity;
    private Double maxBudget;
    private Integer preferredBedrooms;
    private String preferredLifestyle;
    private Boolean petFriendlyNeeded;
    private Boolean parkingNeeded;
    private Boolean gymNeeded;
    private LocalDateTime createdAt;

    public UserDTO() {}

    public UserDTO(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.fullName = user.getFullName();
        this.phone = user.getPhone();
        this.role = user.getRole();
        this.avatarUrl = user.getAvatarUrl();
        this.preferredCity = user.getPreferredCity();
        this.maxBudget = user.getMaxBudget();
        this.preferredBedrooms = user.getPreferredBedrooms();
        this.preferredLifestyle = user.getPreferredLifestyle();
        this.petFriendlyNeeded = user.getPetFriendlyNeeded();
        this.parkingNeeded = user.getParkingNeeded();
        this.gymNeeded = user.getGymNeeded();
        this.createdAt = user.getCreatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getPreferredCity() { return preferredCity; }
    public void setPreferredCity(String preferredCity) { this.preferredCity = preferredCity; }

    public Double getMaxBudget() { return maxBudget; }
    public void setMaxBudget(Double maxBudget) { this.maxBudget = maxBudget; }

    public Integer getPreferredBedrooms() { return preferredBedrooms; }
    public void setPreferredBedrooms(Integer preferredBedrooms) { this.preferredBedrooms = preferredBedrooms; }

    public String getPreferredLifestyle() { return preferredLifestyle; }
    public void setPreferredLifestyle(String preferredLifestyle) { this.preferredLifestyle = preferredLifestyle; }

    public Boolean getPetFriendlyNeeded() { return petFriendlyNeeded; }
    public void setPetFriendlyNeeded(Boolean petFriendlyNeeded) { this.petFriendlyNeeded = petFriendlyNeeded; }

    public Boolean getParkingNeeded() { return parkingNeeded; }
    public void setParkingNeeded(Boolean parkingNeeded) { this.parkingNeeded = parkingNeeded; }

    public Boolean getGymNeeded() { return gymNeeded; }
    public void setGymNeeded(Boolean gymNeeded) { this.gymNeeded = gymNeeded; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
