package com.assertflow.modules.assets;

import com.assertflow.modules.assets.dto.AllocationRequest;
import com.assertflow.modules.assets.dto.AllocationResponse;
import com.assertflow.modules.auth.Role;
import com.assertflow.modules.auth.User;
import com.assertflow.modules.auth.UserRepository;
import com.assertflow.modules.auth.UserStatus;
import com.assertflow.modules.booking.BookingService;
import com.assertflow.modules.booking.dto.BookingRequest;
import com.assertflow.modules.booking.dto.BookingResponse;
import com.assertflow.modules.organization.AssetCategory;
import com.assertflow.modules.organization.AssetCategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class AllocationAndBookingTest {

    @Autowired
    private AllocationService allocationService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AssetCategoryRepository categoryRepository;

    private User testUser1;
    private User testUser2;
    private AssetCategory laptopCategory;
    private AssetCategory roomCategory;

    @BeforeEach
    public void setup() {
        testUser1 = User.builder()
                .name("Alex Smith")
                .email("alex@assertflow.io")
                .password("encoded_pass")
                .role(Role.EMPLOYEE)
                .status(UserStatus.ACTIVE)
                .build();
        testUser1 = userRepository.save(testUser1);

        testUser2 = User.builder()
                .name("Megan Doe")
                .email("megan@assertflow.io")
                .password("encoded_pass")
                .role(Role.ASSET_MANAGER)
                .status(UserStatus.ACTIVE)
                .build();
        testUser2 = userRepository.save(testUser2);

        laptopCategory = AssetCategory.builder().name("Laptops").build();
        laptopCategory = categoryRepository.save(laptopCategory);

        roomCategory = AssetCategory.builder().name("Conference Rooms").build();
        roomCategory = categoryRepository.save(roomCategory);
    }

    @Test
    public void testDoubleAllocationPrevention() {
        // 1. Create a physical laptop (not bookable)
        Asset laptop = Asset.builder()
                .tag("AST-L001")
                .name("ThinkPad T14")
                .serialNumber("SN-TP-1111")
                .category(laptopCategory)
                .acquisitionDate(LocalDate.now())
                .cost(new BigDecimal("1200.00"))
                .condition("NEW")
                .location("HQ - Floor 1")
                .isBookable(false)
                .status(AssetStatus.AVAILABLE)
                .build();
        laptop = assetRepository.save(laptop);

        // 2. Allocate to User 1
        AllocationRequest req1 = new AllocationRequest();
        req1.setAssetId(laptop.getId());
        req1.setUserId(testUser1.getId());
        req1.setDueDate(LocalDate.now().plusDays(30));

        AllocationResponse res1 = allocationService.allocateAsset(req1);
        assertNotNull(res1.getId());
        assertEquals(AllocationStatus.ACTIVE, res1.getStatus());

        // Verify asset status is now ALLOCATED
        Asset updatedLaptop = assetRepository.findById(laptop.getId()).orElseThrow();
        assertEquals(AssetStatus.ALLOCATED, updatedLaptop.getStatus());

        // 3. Attempt to allocate same asset to User 2 (Double-allocation validation)
        AllocationRequest req2 = new AllocationRequest();
        req2.setAssetId(laptop.getId());
        req2.setUserId(testUser2.getId());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            allocationService.allocateAsset(req2);
        });
        assertTrue(ex.getMessage().contains("Asset is not available for allocation"));

        // 4. Return the asset
        AllocationResponse resReturn = allocationService.returnAsset(res1.getId(), "Returned in perfect condition.");
        assertEquals(AllocationStatus.RETURNED, resReturn.getStatus());
        assertNotNull(resReturn.getReturnedDate());

        // Verify status back to AVAILABLE
        Asset returnedLaptop = assetRepository.findById(laptop.getId()).orElseThrow();
        assertEquals(AssetStatus.AVAILABLE, returnedLaptop.getStatus());
    }

    @Test
    public void testBookingOverlapValidation() {
        // 1. Create a reserveable conference room
        Asset room = Asset.builder()
                .tag("AST-R001")
                .name("Conference Room A")
                .serialNumber("SN-ROOM-A")
                .category(roomCategory)
                .acquisitionDate(LocalDate.now())
                .cost(new BigDecimal("5000.00"))
                .condition("GOOD")
                .location("HQ - Floor 2")
                .isBookable(true)
                .status(AssetStatus.AVAILABLE)
                .build();
        room = assetRepository.save(room);

        // Define timeslots
        LocalDateTime tenAM = LocalDateTime.now().withHour(10).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime twelvePM = tenAM.plusHours(2); // 10:00 - 12:00
        LocalDateTime elevenAM = tenAM.plusHours(1);
        LocalDateTime onePM = tenAM.plusHours(3); // 11:00 - 13:00
        LocalDateTime nineAM = tenAM.minusHours(1);
        LocalDateTime tenThirtyAM = tenAM.plusMinutes(30); // 09:00 - 10:30
        LocalDateTime oneThirtyPM = tenAM.plusHours(3).plusMinutes(30); // 12:00 - 13:30 (adjacent)

        // 2. Booking 1: 10:00 - 12:00
        BookingRequest req1 = new BookingRequest();
        req1.setAssetId(room.getId());
        req1.setUserId(testUser1.getId());
        req1.setStartTime(tenAM);
        req1.setEndTime(twelvePM);

        BookingResponse res1 = bookingService.createBooking(req1);
        assertNotNull(res1.getId());

        // 3. Try overlapping booking 2: 11:00 - 13:00 (late start inside Booking 1)
        BookingRequest req2 = new BookingRequest();
        req2.setAssetId(room.getId());
        req2.setUserId(testUser2.getId());
        req2.setStartTime(elevenAM);
        req2.setEndTime(onePM);

        IllegalArgumentException ex1 = assertThrows(IllegalArgumentException.class, () -> {
            bookingService.createBooking(req2);
        });
        assertTrue(ex1.getMessage().contains("already reserved during the requested period"));

        // 4. Try overlapping booking 3: 09:00 - 10:30 (early start overlapping Booking
        // 1)
        BookingRequest req3 = new BookingRequest();
        req3.setAssetId(room.getId());
        req3.setUserId(testUser2.getId());
        req3.setStartTime(nineAM);
        req3.setEndTime(tenThirtyAM);

        IllegalArgumentException ex2 = assertThrows(IllegalArgumentException.class, () -> {
            bookingService.createBooking(req3);
        });
        assertTrue(ex2.getMessage().contains("already reserved during the requested period"));

        // 5. Try adjacent booking 4: 12:00 - 13:30 (should succeed since границы are
        // exclusive)
        BookingRequest req4 = new BookingRequest();
        req4.setAssetId(room.getId());
        req4.setUserId(testUser2.getId());
        req4.setStartTime(twelvePM);
        req4.setEndTime(oneThirtyPM);

        BookingResponse res4 = bookingService.createBooking(req4);
        assertNotNull(res4.getId());
    }

    @Test
    public void testBookingNonBookableAssetRejection() {
        Asset nonBookableLaptop = Asset.builder()
                .tag("AST-L002")
                .name("ThinkPad P1")
                .serialNumber("SN-TP-2222")
                .category(laptopCategory)
                .acquisitionDate(LocalDate.now())
                .cost(new BigDecimal("2200.00"))
                .condition("NEW")
                .location("HQ - Floor 1")
                .isBookable(false)
                .status(AssetStatus.AVAILABLE)
                .build();
        nonBookableLaptop = assetRepository.save(nonBookableLaptop);

        BookingRequest req = new BookingRequest();
        req.setAssetId(nonBookableLaptop.getId());
        req.setUserId(testUser1.getId());
        req.setStartTime(LocalDateTime.now().plusDays(1).withHour(10).withMinute(0));
        req.setEndTime(LocalDateTime.now().plusDays(1).withHour(12).withMinute(0));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            bookingService.createBooking(req);
        });
        assertTrue(ex.getMessage().contains("not set as bookable/reservable"));
    }
}
