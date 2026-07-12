package com.assertflow.modules.assets;

import com.assertflow.modules.assets.dto.AssetRequest;
import com.assertflow.modules.assets.dto.AssetResponse;
import com.assertflow.modules.organization.AssetCategory;
import com.assertflow.modules.organization.AssetCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AssetService {

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private AssetCategoryRepository categoryRepository;

    @Transactional
    public synchronized AssetResponse registerAsset(AssetRequest request) {
        if (assetRepository.findBySerialNumber(request.getSerialNumber()).isPresent()) {
            throw new IllegalArgumentException("Asset with this serial number already exists.");
        }

        AssetCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Asset category not found."));

        String tag = generateNextTag();

        Asset asset = Asset.builder()
                .tag(tag)
                .name(request.getName())
                .serialNumber(request.getSerialNumber())
                .category(category)
                .acquisitionDate(request.getAcquisitionDate())
                .cost(request.getCost())
                .condition(request.getCondition().toUpperCase())
                .location(request.getLocation())
                .isBookable(request.isBookable())
                .status(AssetStatus.AVAILABLE)
                .build();

        asset = assetRepository.save(asset);
        return mapToResponse(asset);
    }

    @Transactional(readOnly = true)
    public List<AssetResponse> getAllAssets() {
        return assetRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AssetResponse getAssetById(UUID id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Asset not found."));
        return mapToResponse(asset);
    }

    @Transactional
    public AssetResponse updateAsset(UUID id, AssetRequest request) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Asset not found."));

        Optional<Asset> existingWithSN = assetRepository.findBySerialNumber(request.getSerialNumber());
        if (existingWithSN.isPresent() && !existingWithSN.get().getId().equals(id)) {
            throw new IllegalArgumentException("Asset with this serial number already exists.");
        }

        AssetCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Asset category not found."));

        asset.setName(request.getName());
        asset.setSerialNumber(request.getSerialNumber());
        asset.setCategory(category);
        asset.setAcquisitionDate(request.getAcquisitionDate());
        asset.setCost(request.getCost());
        asset.setCondition(request.getCondition().toUpperCase());
        asset.setLocation(request.getLocation());
        asset.setBookable(request.isBookable());

        asset = assetRepository.save(asset);
        return mapToResponse(asset);
    }

    @Transactional
    public void deleteAsset(UUID id) {
        if (!assetRepository.existsById(id)) {
            throw new IllegalArgumentException("Asset not found.");
        }
        assetRepository.deleteById(id);
    }

    private synchronized String generateNextTag() {
        Optional<Asset> latestAssetOpt = assetRepository.findTopByOrderByTagDesc();
        if (latestAssetOpt.isEmpty()) {
            return "AST-0001";
        }

        String latestTag = latestAssetOpt.get().getTag();
        try {
            int numericPart = Integer.parseInt(latestTag.substring(4)); // Skip "AST-"
            return String.format("AST-%04d", numericPart + 1);
        } catch (Exception e) {
            return "AST-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        }
    }

    private AssetResponse mapToResponse(Asset asset) {
        return AssetResponse.builder()
                .id(asset.getId())
                .tag(asset.getTag())
                .name(asset.getName())
                .serialNumber(asset.getSerialNumber())
                .categoryId(asset.getCategory().getId())
                .categoryName(asset.getCategory().getName())
                .acquisitionDate(asset.getAcquisitionDate())
                .cost(asset.getCost())
                .condition(asset.getCondition())
                .location(asset.getLocation())
                .isBookable(asset.isBookable())
                .status(asset.getStatus())
                .build();
    }
}
