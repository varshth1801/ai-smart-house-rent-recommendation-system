package com.smartrent.service;

import com.smartrent.dto.BookingRequest;
import com.smartrent.dto.BookingStatusUpdateRequest;
import com.smartrent.entity.*;
import com.smartrent.exception.BadRequestException;
import com.smartrent.exception.ResourceNotFoundException;
import com.smartrent.repository.BookingRepository;
import com.smartrent.repository.PropertyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final PropertyRepository propertyRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    public BookingService(BookingRepository bookingRepository,
                          PropertyRepository propertyRepository,
                          UserService userService,
                          NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.propertyRepository = propertyRepository;
        this.userService = userService;
        this.notificationService = notificationService;
    }

    @Transactional
    public BookingApplication createBookingApplication(BookingRequest req) {
        User tenant = userService.getCurrentAuthenticatedUser();
        Property property = propertyRepository.findById(req.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + req.getPropertyId()));

        if (property.getLandlord().getId().equals(tenant.getId())) {
            throw new BadRequestException("You cannot submit a rental application for your own property!");
        }

        BookingApplication app = new BookingApplication();
        app.setProperty(property);
        app.setTenant(tenant);
        app.setLandlord(property.getLandlord());
        app.setRequestedMoveInDate(req.getRequestedMoveInDate());
        app.setLeaseDurationMonths(req.getLeaseDurationMonths() != null ? req.getLeaseDurationMonths() : 12);
        app.setMessage(req.getMessage());
        app.setMonthlyIncome(req.getMonthlyIncome());
        app.setEmploymentStatus(req.getEmploymentStatus());
        app.setNumberOfOccupants(req.getNumberOfOccupants() != null ? req.getNumberOfOccupants() : 1);
        app.setHasPets(req.getHasPets() != null ? req.getHasPets() : false);
        app.setTourDateTime(req.getTourDateTime());
        app.setTourType(req.getTourType());
        app.setStatus(req.getTourDateTime() != null ? BookingStatus.TOUR_SCHEDULED : BookingStatus.PENDING);

        BookingApplication saved = bookingRepository.save(app);

        // Notify Landlord
        notificationService.sendNotification(
                property.getLandlord(),
                "New Rental Application / Tour Request",
                String.format("%s submitted a rental request for '%s'.", tenant.getFullName(), property.getTitle()),
                "NEW_INQUIRY",
                "/dashboard"
        );

        return saved;
    }

    public List<BookingApplication> getApplicationsForTenant() {
        User tenant = userService.getCurrentAuthenticatedUser();
        return bookingRepository.findByTenantIdOrderByCreatedAtDesc(tenant.getId());
    }

    public List<BookingApplication> getApplicationsForLandlord() {
        User landlord = userService.getCurrentAuthenticatedUser();
        return bookingRepository.findByLandlordIdOrderByCreatedAtDesc(landlord.getId());
    }

    public List<BookingApplication> getApplicationsByProperty(Long propertyId) {
        return bookingRepository.findByPropertyIdOrderByCreatedAtDesc(propertyId);
    }

    @Transactional
    public BookingApplication updateApplicationStatus(Long applicationId, BookingStatusUpdateRequest req) {
        BookingApplication app = bookingRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        User current = userService.getCurrentAuthenticatedUser();
        if (!app.getLandlord().getId().equals(current.getId()) && !current.getRole().name().equals("ROLE_ADMIN")) {
            throw new BadRequestException("You are not authorized to update this rental application.");
        }

        app.setStatus(req.getStatus());
        if (req.getLandlordNotes() != null) {
            app.setLandlordNotes(req.getLandlordNotes());
        }
        if (req.getConfirmedTourDate() != null) {
            app.setTourDateTime(req.getConfirmedTourDate());
        }

        BookingApplication saved = bookingRepository.save(app);

        // Notify Tenant
        notificationService.sendNotification(
                app.getTenant(),
                "Application Status Update: " + req.getStatus(),
                String.format("Your rental application for '%s' has been marked as %s.", app.getProperty().getTitle(), req.getStatus()),
                "BOOKING_UPDATE",
                "/dashboard"
        );

        return saved;
    }
}
