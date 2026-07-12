package com.assertflow.modules.assets;

import com.assertflow.modules.assets.dto.AllocationRequest;
import com.assertflow.modules.assets.dto.AllocationResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/allocations")
public class AllocationController {

    @Autowired
    private AllocationService allocationService;

    @PostMapping
    public ResponseEntity<AllocationResponse> allocateAsset(@Valid @RequestBody AllocationRequest request) {
        return ResponseEntity.ok(allocationService.allocateAsset(request));
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<AllocationResponse> returnAsset(
            @PathVariable UUID id,
            @RequestParam(required = false) String notes) {
        return ResponseEntity.ok(allocationService.returnAsset(id, notes));
    }

    @GetMapping
    public ResponseEntity<List<AllocationResponse>> getAllAllocations() {
        return ResponseEntity.ok(allocationService.getAllAllocations());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AllocationResponse>> getUserAllocations(@PathVariable UUID userId) {
        return ResponseEntity.ok(allocationService.getUserAllocations(userId));
    }
}
