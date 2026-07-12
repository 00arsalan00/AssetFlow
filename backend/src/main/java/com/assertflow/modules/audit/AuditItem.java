package com.assertflow.modules.audit;

import com.assertflow.modules.assets.Asset;
import com.assertflow.modules.auth.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "audit_cycle_id", nullable = false)
    private AuditCycle auditCycle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auditor_id")
    private User auditor;

    @Column(name = "audit_date")
    private LocalDateTime auditDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditItemStatus status;

    private String notes;
}
