package com.smartrent.repository;

import com.smartrent.entity.BookingApplication;
import com.smartrent.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<BookingApplication, Long> {
    List<BookingApplication> findByTenantIdOrderByCreatedAtDesc(Long tenantId);
    List<BookingApplication> findByLandlordIdOrderByCreatedAtDesc(Long landlordId);
    List<BookingApplication> findByPropertyIdOrderByCreatedAtDesc(Long propertyId);
    List<BookingApplication> findByStatus(BookingStatus status);
}
