package com.smartrent.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Email
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank
    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @NotBlank
    @Column(nullable = false)
    private String fullName;

    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.ROLE_TENANT;

    private String avatarUrl;

    // AI recommendation preference profiles for Tenant
    private String preferredCity;
    private Double maxBudget;
    private Integer preferredBedrooms;
    private String preferredLifestyle; // e.g. "quiet", "party", "family", "student", "pet_owner"
    private Boolean petFriendlyNeeded = false;
    private Boolean parkingNeeded = false;
    private Boolean gymNeeded = false;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public User() {
    }

    public User(String email, String password, String fullName, String phone, Role role) {
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.phone = phone;
        this.role = role;
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

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

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
