package com.smartrent.controller;

import com.smartrent.dto.BookingRequest;
import com.smartrent.dto.BookingStatusUpdateRequest;
import com.smartrent.entity.BookingApplication;
import com.smartrent.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingApplication> submitBookingApplication(@Valid @RequestBody BookingRequest request) {
        BookingApplication app = bookingService.createBookingApplication(request);
        return new ResponseEntity<>(app, HttpStatus.CREATED);
    }

    @GetMapping("/tenant")
    public ResponseEntity<List<BookingApplication>> getTenantBookings() {
        return ResponseEntity.ok(bookingService.getApplicationsForTenant());
    }

    @GetMapping("/landlord")
    public ResponseEntity<List<BookingApplication>> getLandlordBookings() {
        return ResponseEntity.ok(bookingService.getApplicationsForLandlord());
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<BookingApplication>> getBookingsForProperty(@PathVariable Long propertyId) {
        return ResponseEntity.ok(bookingService.getApplicationsByProperty(propertyId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<BookingApplication> updateBookingStatus(
            @PathVariable Long id,
            @Valid @RequestBody BookingStatusUpdateRequest request) {
        return ResponseEntity.ok(bookingService.updateApplicationStatus(id, request));
    }
}
