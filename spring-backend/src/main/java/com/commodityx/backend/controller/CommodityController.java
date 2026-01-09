package com.commodityx.backend.controller;

import com.commodityx.backend.model.Commodity;
import com.commodityx.backend.service.CommodityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/commodities")
public class CommodityController {

    @Autowired
    private CommodityService commodityService;

    @GetMapping
    public ResponseEntity<List<Commodity>> getAllCommodities() {
        List<Commodity> commodities = commodityService.getAllCommodities();
        return ResponseEntity.ok(commodities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCommodityById(@PathVariable Long id) {
        try {
            Commodity commodity = commodityService.getCommodityById(id);
            return ResponseEntity.ok(commodity);
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
}
