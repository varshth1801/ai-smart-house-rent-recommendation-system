package com.smartrent.repository;

import com.smartrent.entity.Property;
import com.smartrent.entity.PropertyStatus;
import com.smartrent.entity.PropertyType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    List<Property> findByStatus(PropertyStatus status);

    List<Property> findByLandlordId(Long landlordId);

    @Query("SELECT p FROM Property p WHERE p.status = 'AVAILABLE' AND (" +
           "(:city IS NULL OR LOWER(p.city) LIKE LOWER(CONCAT('%', :city, '%')) OR LOWER(p.neighborhood) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:bedrooms IS NULL OR p.bedrooms = :bedrooms) AND " +
           "(:propertyType IS NULL OR p.propertyType = :propertyType) AND " +
           "(:petFriendly IS NULL OR p.petFriendly = :petFriendly) AND " +
           "(:parkingAvailable IS NULL OR p.parkingAvailable = :parkingAvailable) AND " +
           "(:gym IS NULL OR p.gym = :gym))")
    List<Property> searchProperties(
            @Param("city") String city,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("bedrooms") Integer bedrooms,
            @Param("propertyType") PropertyType propertyType,
            @Param("petFriendly") Boolean petFriendly,
            @Param("parkingAvailable") Boolean parkingAvailable,
            @Param("gym") Boolean gym
    );

    @Query("SELECT DISTINCT p.city FROM Property p WHERE p.city IS NOT NULL")
    List<String> findDistinctCities();

    long countByStatus(PropertyStatus status);
}
