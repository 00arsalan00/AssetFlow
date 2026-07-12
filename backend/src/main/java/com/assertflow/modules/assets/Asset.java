package com.assertflow.modules.assets;

import com.assertflow.modules.organization.AssetCategory;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "assets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String tag;

    @Column(nullable = false)
    private String name;

    @Column(name = "serial_number", unique = true)
    private String serialNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private AssetCategory category;

    @Column(name = "acquisition_date")
    private LocalDate acquisitionDate;

    @Column(nullable = false)
    private BigDecimal cost;

    @Column(nullable = false)
    private String condition;

    @Column(nullable = false)
    private String location;

    @Column(name = "is_bookable", nullable = false)
    private boolean isBookable;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssetStatus status;
}
