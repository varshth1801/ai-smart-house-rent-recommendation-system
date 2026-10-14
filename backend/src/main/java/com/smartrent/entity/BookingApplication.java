package com.smartrent.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "booking_applications")
public class BookingApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tenant_id", nullable = false)
    @JsonIgnoreProperties({"password"})
    private User tenant;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "landlord_id", nullable = false)
    @JsonIgnoreProperties({"password"})
    private User landlord;

    private LocalDate requestedMoveInDate;
    private Integer leaseDurationMonths = 12;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String message;

    private Double monthlyIncome;
    private String employmentStatus; // "Employed", "Self-Employed", "Student"
    private Integer numberOfOccupants = 1;
    private Boolean hasPets = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    private LocalDateTime tourDateTime;
    private String tourType; // "IN_PERSON", "VIRTUAL_VIDEO"

    private String landlordNotes;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public BookingApplication() {
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public User getTenant() { return tenant; }
    public void setTenant(User tenant) { this.tenant = tenant; }

    public User getLandlord() { return landlord; }
    public void setLandlord(User landlord) { this.landlord = landlord; }

    public LocalDate getRequestedMoveInDate() { return requestedMoveInDate; }
    public void setRequestedMoveInDate(LocalDate requestedMoveInDate) { this.requestedMoveInDate = requestedMoveInDate; }

    public Integer getLeaseDurationMonths() { return leaseDurationMonths; }
    public void setLeaseDurationMonths(Integer leaseDurationMonths) { this.leaseDurationMonths = leaseDurationMonths; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Double getMonthlyIncome() { return monthlyIncome; }
    public void setMonthlyIncome(Double monthlyIncome) { this.monthlyIncome = monthlyIncome; }

    public String getEmploymentStatus() { return employmentStatus; }
    public void setEmploymentStatus(String employmentStatus) { this.employmentStatus = employmentStatus; }

    public Integer getNumberOfOccupants() { return numberOfOccupants; }
    public void setNumberOfOccupants(Integer numberOfOccupants) { this.numberOfOccupants = numberOfOccupants; }

    public Boolean getHasPets() { return hasPets; }
    public void setHasPets(Boolean hasPets) { this.hasPets = hasPets; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public LocalDateTime getTourDateTime() { return tourDateTime; }
    public void setTourDateTime(LocalDateTime tourDateTime) { this.tourDateTime = tourDateTime; }

    public String getTourType() { return tourType; }
    public void setTourType(String tourType) { this.tourType = tourType; }

    public String getLandlordNotes() { return landlordNotes; }
    public void setLandlordNotes(String landlordNotes) { this.landlordNotes = landlordNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
