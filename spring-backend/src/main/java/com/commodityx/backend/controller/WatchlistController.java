package com.commodityx.backend.controller;

import com.commodityx.backend.dto.WatchlistRequest;
import com.commodityx.backend.model.Watchlist;
import com.commodityx.backend.service.WatchlistService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    @Autowired
    private WatchlistService watchlistService;

    @GetMapping
    public ResponseEntity<List<Watchlist>> getUserWatchlist() {
        List<Watchlist> watchlist = watchlistService.getUserWatchlist();
        return ResponseEntity.ok(watchlist);
    }

    @PostMapping
    public ResponseEntity<?> addToWatchlist(@Valid @RequestBody WatchlistRequest request) {
        try {
            Watchlist watchlist = watchlistService.addToWatchlist(request.getCommodityId());
            return ResponseEntity.ok(watchlist);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{commodityId}")
    public ResponseEntity<?> removeFromWatchlist(@PathVariable Long commodityId) {
        try {
            watchlistService.removeFromWatchlist(commodityId);
            return ResponseEntity.ok(new MessageResponse("Removed from watchlist successfully"));
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
