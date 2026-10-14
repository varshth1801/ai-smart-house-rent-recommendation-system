package com.smartrent.dto;

import com.smartrent.entity.BookingStatus;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class BookingStatusUpdateRequest {
    @NotNull
    private BookingStatus status;
    private String landlordNotes;
    private LocalDateTime confirmedTourDate;

    public BookingStatusUpdateRequest() {}

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public String getLandlordNotes() { return landlordNotes; }
    public void setLandlordNotes(String landlordNotes) { this.landlordNotes = landlordNotes; }

    public LocalDateTime getConfirmedTourDate() { return confirmedTourDate; }
    public void setConfirmedTourDate(LocalDateTime confirmedTourDate) { this.confirmedTourDate = confirmedTourDate; }
}
