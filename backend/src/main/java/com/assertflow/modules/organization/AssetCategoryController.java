package com.assertflow.modules.organization;

import com.assertflow.modules.organization.dto.AssetCategoryRequest;
import com.assertflow.modules.organization.dto.AssetCategoryResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/categories")
public class AssetCategoryController {

    @Autowired
    private AssetCategoryService assetCategoryService;

    @PostMapping
    public ResponseEntity<AssetCategoryResponse> createCategory(@Valid @RequestBody AssetCategoryRequest request) {
        return ResponseEntity.ok(assetCategoryService.createCategory(request));
    }

    @GetMapping
    public ResponseEntity<List<AssetCategoryResponse>> getAllCategories() {
        return ResponseEntity.ok(assetCategoryService.getAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssetCategoryResponse> getCategoryById(@PathVariable UUID id) {
        return ResponseEntity.ok(assetCategoryService.getCategoryById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssetCategoryResponse> updateCategory(
            @PathVariable UUID id,
            @Valid @RequestBody AssetCategoryRequest request) {
        return ResponseEntity.ok(assetCategoryService.updateCategory(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable UUID id) {
        assetCategoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
