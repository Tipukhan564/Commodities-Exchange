package com.commodityx.backend.controller;

import com.commodityx.backend.dto.OrderRequest;
import com.commodityx.backend.model.Order;
import com.commodityx.backend.model.Portfolio;
import com.commodityx.backend.service.TradingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trading")
public class TradingController {

    @Autowired
    private TradingService tradingService;

    @PostMapping("/order")
    public ResponseEntity<?> placeOrder(@Valid @RequestBody OrderRequest request) {
        try {
            Order order = tradingService.placeOrder(request);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getUserOrders() {
        List<Order> orders = tradingService.getUserOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/portfolio")
    public ResponseEntity<List<Portfolio>> getUserPortfolio() {
        List<Portfolio> portfolio = tradingService.getUserPortfolio();
        return ResponseEntity.ok(portfolio);
    }

    @DeleteMapping("/orders/{id}")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id) {
        try {
            tradingService.cancelOrder(id);
            return ResponseEntity.ok(new MessageResponse("Order cancelled successfully"));
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
