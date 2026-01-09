package com.commodityx.backend.controller;

import com.commodityx.backend.dto.AlertRequest;
import com.commodityx.backend.model.PriceAlert;
import com.commodityx.backend.service.AlertService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    @Autowired
    private AlertService alertService;

    @GetMapping
    public ResponseEntity<List<PriceAlert>> getUserAlerts() {
        List<PriceAlert> alerts = alertService.getUserAlerts();
        return ResponseEntity.ok(alerts);
    }

    @PostMapping
    public ResponseEntity<?> createAlert(@Valid @RequestBody AlertRequest request) {
        try {
            PriceAlert alert = alertService.createAlert(request);
            return ResponseEntity.ok(alert);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAlert(@PathVariable Long id) {
        try {
            alertService.deleteAlert(id);
            return ResponseEntity.ok(new MessageResponse("Alert deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    static class MessageResponse {
        private String message;

        public MessageResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
