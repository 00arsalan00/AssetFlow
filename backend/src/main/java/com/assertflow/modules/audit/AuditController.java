package com.assertflow.modules.audit;

import com.assertflow.modules.audit.dto.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/audits")
public class AuditController {

    @Autowired
    private AuditService auditService;

    @PostMapping("/cycles")
    public ResponseEntity<AuditCycleResponse> createAuditCycle(@Valid @RequestBody AuditCycleRequest request) {
        return ResponseEntity.ok(auditService.createAuditCycle(request));
    }

    @PostMapping("/items/{itemId}/verify")
    public ResponseEntity<AuditItemResponse> verifyAuditItem(
            @PathVariable UUID itemId,
            @Valid @RequestBody AuditItemVerificationRequest request) {
        return ResponseEntity.ok(auditService.verifyAuditItem(itemId, request));
    }

    @PostMapping("/cycles/{cycleId}/complete")
    public ResponseEntity<AuditCycleResponse> completeAuditCycle(@PathVariable UUID cycleId) {
        return ResponseEntity.ok(auditService.completeAuditCycle(cycleId));
    }

    @GetMapping("/cycles")
    public ResponseEntity<List<AuditCycleResponse>> getAllAuditCycles() {
        return ResponseEntity.ok(auditService.getAllAuditCycles());
    }

    @GetMapping("/cycles/{cycleId}/items")
    public ResponseEntity<List<AuditItemResponse>> getCycleItems(@PathVariable UUID cycleId) {
        return ResponseEntity.ok(auditService.getCycleItems(cycleId));
    }

    @GetMapping("/cycles/{cycleId}/summary")
    public ResponseEntity<AuditSummaryResponse> getAuditSummary(@PathVariable UUID cycleId) {
        return ResponseEntity.ok(auditService.getAuditSummary(cycleId));
    }
}
