package com.trainguard.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public String root() {
        return "Smart Gauge API is running";
    }

    @GetMapping("/api/health")
    public String health() {
        return "Smart Gauge backend is running";
    }
}