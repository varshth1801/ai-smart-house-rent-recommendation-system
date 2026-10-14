package com.smartrent.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingRequest {
    @NotNull
    private Long propertyId;

    private LocalDate requestedMoveInDate;
    private Integer leaseDurationMonths = 12;
    private String message;
    private Double monthlyIncome;
    private String employmentStatus;
    private Integer numberOfOccupants = 1;
    private Boolean hasPets = false;
    private LocalDateTime tourDateTime;
    private String tourType; // "IN_PERSON", "VIRTUAL_VIDEO"

    public BookingRequest() {}

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

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

    public LocalDateTime getTourDateTime() { return tourDateTime; }
    public void setTourDateTime(LocalDateTime tourDateTime) { this.tourDateTime = tourDateTime; }

    public String getTourType() { return tourType; }
    public void setTourType(String tourType) { this.tourType = tourType; }
}
