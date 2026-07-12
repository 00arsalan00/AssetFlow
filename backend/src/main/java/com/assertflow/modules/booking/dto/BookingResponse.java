package com.assertflow.modules.booking.dto;

import com.assertflow.modules.booking.BookingStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class BookingResponse {
    private UUID id;
    private UUID assetId;
    private String assetTag;
    private String assetName;
    private UUID userId;
    private String userEmail;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BookingStatus status;
}
