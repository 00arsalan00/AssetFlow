package com.assertflow.modules.audit;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "audit_cycles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditCycle {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "created_date", nullable = false)
    private LocalDate createdDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditCycleStatus status;
}
