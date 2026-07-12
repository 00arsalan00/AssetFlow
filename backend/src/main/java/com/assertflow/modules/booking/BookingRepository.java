package com.assertflow.modules.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    List<Booking> findByUserId(UUID userId);

    List<Booking> findByAssetId(UUID assetId);

    @Query("SELECT b FROM Booking b WHERE b.asset.id = :assetId " +
            "AND b.status IN ('APPROVED', 'PENDING_APPROVAL') " +
            "AND b.startTime < :endTime AND b.endTime > :startTime")
    List<Booking> findOverlappingBookings(
            @Param("assetId") UUID assetId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);
}
