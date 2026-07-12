package com.assertflow.modules.assets;

import com.assertflow.modules.assets.dto.AssetRequest;
import com.assertflow.modules.assets.dto.AssetResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    @Autowired
    private AssetService assetService;

    @PostMapping
    public ResponseEntity<AssetResponse> registerAsset(@Valid @RequestBody AssetRequest request) {
        return ResponseEntity.ok(assetService.registerAsset(request));
    }

    @GetMapping
    public ResponseEntity<List<AssetResponse>> getAllAssets() {
        return ResponseEntity.ok(assetService.getAllAssets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssetResponse> getAssetById(@PathVariable UUID id) {
        return ResponseEntity.ok(assetService.getAssetById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssetResponse> updateAsset(
            @PathVariable UUID id,
            @Valid @RequestBody AssetRequest request) {
        return ResponseEntity.ok(assetService.updateAsset(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAsset(@PathVariable UUID id) {
        assetService.deleteAsset(id);
        return ResponseEntity.noContent().build();
    }
}
