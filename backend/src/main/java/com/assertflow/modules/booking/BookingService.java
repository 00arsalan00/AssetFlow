package com.assertflow.modules.booking;

import com.assertflow.modules.assets.Asset;
import com.assertflow.modules.assets.AssetRepository;
import com.assertflow.modules.auth.User;
import com.assertflow.modules.auth.UserRepository;
import com.assertflow.modules.booking.dto.BookingRequest;
import com.assertflow.modules.booking.dto.BookingResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public synchronized BookingResponse createBooking(BookingRequest request) {
        if (request.getStartTime().isAfter(request.getEndTime())
                || request.getStartTime().isEqual(request.getEndTime())) {
            throw new IllegalArgumentException("Booking start time must be before end time.");
        }

        Asset asset = assetRepository.findById(request.getAssetId())
                .orElseThrow(() -> new IllegalArgumentException("Asset not found."));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        if (!asset.isBookable()) {
            throw new IllegalArgumentException("This asset is not set as bookable/reservable.");
        }

        // Overlap Validation Check
        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                request.getAssetId(), request.getStartTime(), request.getEndTime());

        if (!overlapping.isEmpty()) {
            throw new IllegalArgumentException("The asset is already reserved during the requested period.");
        }

        Booking booking = Booking.builder()
                .asset(asset)
                .user(user)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .status(BookingStatus.APPROVED) // Auto approved to ease exploration
                .build();

        booking = bookingRepository.save(booking);
        return mapToResponse(booking);
    }

    @Transactional
    public BookingResponse updateBookingStatus(UUID id, String statusStr) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found."));

        booking.setStatus(BookingStatus.valueOf(statusStr.toUpperCase()));
        booking = bookingRepository.save(booking);
        return mapToResponse(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getUserBookings(UUID userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private BookingResponse mapToResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .assetId(booking.getAsset().getId())
                .assetTag(booking.getAsset().getTag())
                .assetName(booking.getAsset().getName())
                .userId(booking.getUser().getId())
                .userEmail(booking.getUser().getEmail())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .status(booking.getStatus())
                .build();
    }
}
