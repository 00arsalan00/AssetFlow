package com.assertflow.modules.assets.dto;

import com.assertflow.modules.assets.AllocationStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class AllocationResponse {
    private UUID id;
    private UUID assetId;
    private String assetTag;
    private String assetName;
    private UUID userId;
    private String userEmail;
    private LocalDate allocatedDate;
    private LocalDate dueDate;
    private LocalDate returnedDate;
    private String notes;
    private AllocationStatus status;
}
