package com.commodityx.backend.repository;

import com.commodityx.backend.model.PriceAlert;
import com.commodityx.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PriceAlertRepository extends JpaRepository<PriceAlert, Long> {
    List<PriceAlert> findByUser(User user);
    List<PriceAlert> findByUserAndIsActiveTrue(User user);
}
