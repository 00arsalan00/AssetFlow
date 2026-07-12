package com.assertflow.modules.booking;

import com.assertflow.modules.booking.dto.BookingRequest;
import com.assertflow.modules.booking.dto.BookingResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.createBooking(request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<BookingResponse> updateBookingStatus(
            @PathVariable UUID id,
            @RequestParam String status) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status));
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponse>> getUserBookings(@PathVariable UUID userId) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }
}
