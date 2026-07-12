package com.assertflow.modules.organization;

import com.assertflow.modules.organization.dto.DepartmentRequest;
import com.assertflow.modules.organization.dto.DepartmentResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Transactional
    public DepartmentResponse createDepartment(DepartmentRequest request) {
        if (request.getParentDepartmentId() != null) {
            if (!departmentRepository.existsById(request.getParentDepartmentId())) {
                throw new IllegalArgumentException("Parent department not found.");
            }
        }

        Department department = Department.builder()
                .name(request.getName())
                .status(request.getStatus().toUpperCase())
                .departmentHeadId(request.getDepartmentHeadId())
                .parentDepartmentId(request.getParentDepartmentId())
                .build();

        department = departmentRepository.save(department);
        return mapToResponse(department);
    }

    @Transactional(readOnly = true)
    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DepartmentResponse getDepartmentById(UUID id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Department not found."));
        return mapToResponse(department);
    }

    @Transactional
    public DepartmentResponse updateDepartment(UUID id, DepartmentRequest request) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Department not found."));

        if (request.getParentDepartmentId() != null) {
            if (request.getParentDepartmentId().equals(id)) {
                throw new IllegalArgumentException("A department cannot be its own parent.");
            }
            if (!departmentRepository.existsById(request.getParentDepartmentId())) {
                throw new IllegalArgumentException("Parent department not found.");
            }
        }

        department.setName(request.getName());
        department.setStatus(request.getStatus().toUpperCase());
        department.setDepartmentHeadId(request.getDepartmentHeadId());
        department.setParentDepartmentId(request.getParentDepartmentId());

        department = departmentRepository.save(department);
        return mapToResponse(department);
    }

    @Transactional
    public void deleteDepartment(UUID id) {
        if (!departmentRepository.existsById(id)) {
            throw new IllegalArgumentException("Department not found.");
        }
        departmentRepository.deleteById(id);
    }

    private DepartmentResponse mapToResponse(Department department) {
        return DepartmentResponse.builder()
                .id(department.getId())
                .name(department.getName())
                .status(department.getStatus())
                .departmentHeadId(department.getDepartmentHeadId())
                .parentDepartmentId(department.getParentDepartmentId())
                .build();
    }
}
