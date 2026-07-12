package com.assertflow.modules.maintenance;

import com.assertflow.modules.maintenance.dto.MaintenanceRequestRequest;
import com.assertflow.modules.maintenance.dto.MaintenanceRequestResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceRequestController {

    @Autowired
    private MaintenanceRequestService service;

    @PostMapping
    public ResponseEntity<MaintenanceRequestResponse> createRequest(
            @Valid @RequestBody MaintenanceRequestRequest request) {
        return ResponseEntity.ok(service.createRequest(request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<MaintenanceRequestResponse> updateStatus(
            @PathVariable UUID id,
            @RequestParam String status,
            @RequestParam(required = false) String notes) {
        return ResponseEntity.ok(service.updateStatus(id, status, notes));
    }

    @GetMapping
    public ResponseEntity<List<MaintenanceRequestResponse>> getAllRequests() {
        return ResponseEntity.ok(service.getAllRequests());
    }

    @GetMapping("/asset/{assetId}")
    public ResponseEntity<List<MaintenanceRequestResponse>> getAssetRequests(@PathVariable UUID assetId) {
        return ResponseEntity.ok(service.getAssetRequests(assetId));
    }
}
