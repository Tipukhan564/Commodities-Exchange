package com.commodityx.backend.repository;

import com.commodityx.backend.model.Commodity;
import com.commodityx.backend.model.User;
import com.commodityx.backend.model.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {
    List<Watchlist> findByUser(User user);
    Optional<Watchlist> findByUserAndCommodity(User user, Commodity commodity);
    void deleteByUserAndCommodity(User user, Commodity commodity);
}
