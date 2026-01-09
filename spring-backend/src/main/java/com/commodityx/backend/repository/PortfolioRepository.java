package com.commodityx.backend.repository;

import com.commodityx.backend.model.Commodity;
import com.commodityx.backend.model.Portfolio;
import com.commodityx.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    List<Portfolio> findByUser(User user);
    Optional<Portfolio> findByUserAndCommodity(User user, Commodity commodity);
}
