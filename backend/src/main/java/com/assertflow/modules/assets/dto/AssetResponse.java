package com.assertflow.modules.assets.dto;

import com.assertflow.modules.assets.AssetStatus;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class AssetResponse {
    private UUID id;
    private String tag;
    private String name;
    private String serialNumber;
    private UUID categoryId;
    private String categoryName;
    private LocalDate acquisitionDate;
    private BigDecimal cost;
    private String condition;
    private String location;
    private boolean isBookable;
    private AssetStatus status;
}
