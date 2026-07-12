package com.assertflow.modules.reports;

import com.assertflow.modules.reports.dto.DashboardKPIResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {

    @Autowired
    private ReportsService reportsService;

    @GetMapping("/kpis")
    public ResponseEntity<DashboardKPIResponse> getDashboardKPIs() {
        return ResponseEntity.ok(reportsService.getDashboardKPIs());
    }

    @GetMapping("/logs")
    public ResponseEntity<List<ActivityLog>> getRecentLogs() {
        return ResponseEntity.ok(reportsService.getRecentLogs());
    }
}
