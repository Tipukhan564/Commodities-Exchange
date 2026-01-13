package com.commodityx.backend.service;

import com.commodityx.backend.model.Commodity;
import com.commodityx.backend.model.User;
import com.commodityx.backend.model.Watchlist;
import com.commodityx.backend.repository.CommodityRepository;
import com.commodityx.backend.repository.WatchlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WatchlistService {

    @Autowired
    private WatchlistRepository watchlistRepository;

    @Autowired
    private CommodityRepository commodityRepository;

    @Autowired
    private AuthService authService;

    public List<Watchlist> getUserWatchlist() {
        User user = authService.getCurrentUser();
        return watchlistRepository.findByUser(user);
    }

    @Transactional
    public Watchlist addToWatchlist(Long commodityId) {
        User user = authService.getCurrentUser();
        Commodity commodity = commodityRepository.findById(commodityId)
                .orElseThrow(() -> new RuntimeException("Commodity not found"));

        if (watchlistRepository.findByUserAndCommodity(user, commodity).isPresent()) {
            throw new RuntimeException("Commodity already in watchlist");
        }

        Watchlist watchlist = new Watchlist();
        watchlist.setUser(user);
        watchlist.setCommodity(commodity);
        watchlist.setAddedAt(LocalDateTime.now());

        return watchlistRepository.save(watchlist);
    }

    @Transactional
    public void removeFromWatchlist(Long commodityId) {
        User user = authService.getCurrentUser();
        Commodity commodity = commodityRepository.findById(commodityId)
                .orElseThrow(() -> new RuntimeException("Commodity not found"));

        Watchlist watchlist = watchlistRepository.findByUserAndCommodity(user, commodity)
                .orElseThrow(() -> new RuntimeException("Commodity not in watchlist"));

        watchlistRepository.delete(watchlist);
    }
}
