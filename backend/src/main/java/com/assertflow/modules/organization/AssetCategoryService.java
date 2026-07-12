package com.assertflow.modules.organization;

import com.assertflow.modules.organization.dto.AssetCategoryRequest;
import com.assertflow.modules.organization.dto.AssetCategoryResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AssetCategoryService {

    @Autowired
    private AssetCategoryRepository assetCategoryRepository;

    @Transactional
    public AssetCategoryResponse createCategory(AssetCategoryRequest request) {
        AssetCategory category = AssetCategory.builder()
                .name(request.getName())
                .build();
        category = assetCategoryRepository.save(category);
        return mapToResponse(category);
    }

    @Transactional(readOnly = true)
    public List<AssetCategoryResponse> getAllCategories() {
        return assetCategoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AssetCategoryResponse getCategoryById(UUID id) {
        AssetCategory category = assetCategoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Asset category not found."));
        return mapToResponse(category);
    }

    @Transactional
    public AssetCategoryResponse updateCategory(UUID id, AssetCategoryRequest request) {
        AssetCategory category = assetCategoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Asset category not found."));
        category.setName(request.getName());
        category = assetCategoryRepository.save(category);
        return mapToResponse(category);
    }

    @Transactional
    public void deleteCategory(UUID id) {
        if (!assetCategoryRepository.existsById(id)) {
            throw new IllegalArgumentException("Asset category not found.");
        }
        assetCategoryRepository.deleteById(id);
    }

    private AssetCategoryResponse mapToResponse(AssetCategory category) {
        return AssetCategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .build();
    }
}
