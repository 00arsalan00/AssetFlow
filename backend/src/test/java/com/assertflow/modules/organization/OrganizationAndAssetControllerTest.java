package com.assertflow.modules.organization;

import com.assertflow.modules.assets.AssetRepository;
import com.assertflow.modules.assets.AssetStatus;
import com.assertflow.modules.assets.dto.AssetRequest;
import com.assertflow.modules.organization.dto.AssetCategoryRequest;
import com.assertflow.modules.organization.dto.DepartmentRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class OrganizationAndAssetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AssetCategoryRepository categoryRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private AssetRepository assetRepository;

    @BeforeEach
    public void setup() {
        assetRepository.deleteAll();
        departmentRepository.deleteAll();
        categoryRepository.deleteAll();
    }

    @Test
    @WithMockUser(username = "admin@assertflow.io", roles = { "ADMIN" })
    public void testDepartmentAndCategoryCrudEndpoints() throws Exception {
        // 1. Create a Category
        AssetCategoryRequest categoryRequest = new AssetCategoryRequest();
        categoryRequest.setName("Hardware Laptops");

        String categoryResponseJson = mockMvc.perform(post("/api/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(categoryRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.name", is("Hardware Laptops")))
                .andReturn().getResponse().getContentAsString();

        UUID categoryId = UUID.fromString(objectMapper.readTree(categoryResponseJson).get("id").asText());

        // 2. Fetch all categories
        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name", is("Hardware Laptops")));

        // 3. Create parent department
        DepartmentRequest parentDept = new DepartmentRequest();
        parentDept.setName("Engineering Dept");
        parentDept.setStatus("ACTIVE");

        String parentResponseJson = mockMvc.perform(post("/api/departments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(parentDept)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.name", is("Engineering Dept")))
                .andExpect(jsonPath("$.status", is("ACTIVE")))
                .andReturn().getResponse().getContentAsString();

        UUID parentId = UUID.fromString(objectMapper.readTree(parentResponseJson).get("id").asText());

        // 4. Create child department
        DepartmentRequest childDept = new DepartmentRequest();
        childDept.setName("QA Team");
        childDept.setStatus("ACTIVE");
        childDept.setParentDepartmentId(parentId);

        mockMvc.perform(post("/api/departments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(childDept)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.parentDepartmentId", is(parentId.toString())))
                .andExpect(jsonPath("$.name", is("QA Team")));

        // 5. Fetch all departments
        mockMvc.perform(get("/api/departments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    @WithMockUser(username = "admin@assertflow.io", roles = { "ADMIN" })
    public void testAssetAutoTagSequenceGeneration() throws Exception {
        // 1. Setup a dynamic Category
        AssetCategory category = AssetCategory.builder().name("Monitors Category").build();
        category = categoryRepository.save(category);

        // 2. Register first Asset and assert tag is AST-0001
        AssetRequest assetRequest1 = new AssetRequest();
        assetRequest1.setName("Dell UltraSharp 27");
        assetRequest1.setSerialNumber("SN-DELL-111");
        assetRequest1.setCategoryId(category.getId());
        assetRequest1.setAcquisitionDate(LocalDate.now());
        assetRequest1.setCost(new BigDecimal("349.99"));
        assetRequest1.setCondition("NEW");
        assetRequest1.setLocation("Virtual Zone");
        assetRequest1.setBookable(true);

        mockMvc.perform(post("/api/assets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(assetRequest1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tag", is("AST-0001")))
                .andExpect(jsonPath("$.status", is(AssetStatus.AVAILABLE.toString())))
                .andExpect(jsonPath("$.categoryName", is("Monitors Category")));

        // 3. Register second Asset and assert tag is AST-0002
        AssetRequest assetRequest2 = new AssetRequest();
        assetRequest2.setName("Dell UltraSharp 32");
        assetRequest2.setSerialNumber("SN-DELL-222");
        assetRequest2.setCategoryId(category.getId());
        assetRequest2.setAcquisitionDate(LocalDate.now());
        assetRequest2.setCost(new BigDecimal("599.99"));
        assetRequest2.setCondition("GOOD");
        assetRequest2.setLocation("Virtual Zone B");
        assetRequest2.setBookable(true);

        mockMvc.perform(post("/api/assets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(assetRequest2)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tag", is("AST-0002")));
    }
}
