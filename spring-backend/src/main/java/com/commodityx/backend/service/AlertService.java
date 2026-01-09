package com.commodityx.backend.service;

import com.commodityx.backend.dto.AlertRequest;
import com.commodityx.backend.model.AlertCondition;
import com.commodityx.backend.model.Commodity;
import com.commodityx.backend.model.PriceAlert;
import com.commodityx.backend.model.User;
import com.commodityx.backend.repository.CommodityRepository;
import com.commodityx.backend.repository.PriceAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlertService {

    @Autowired
    private PriceAlertRepository priceAlertRepository;

    @Autowired
    private CommodityRepository commodityRepository;

    @Autowired
    private AuthService authService;

    public List<PriceAlert> getUserAlerts() {
        User user = authService.getCurrentUser();
        return priceAlertRepository.findByUser(user);
    }

    public List<PriceAlert> getUserActiveAlerts() {
        User user = authService.getCurrentUser();
        return priceAlertRepository.findByUserAndIsActiveTrue(user);
    }

    @Transactional
    public PriceAlert createAlert(AlertRequest request) {
        User user = authService.getCurrentUser();
        Commodity commodity = commodityRepository.findById(request.getCommodityId())
                .orElseThrow(() -> new RuntimeException("Commodity not found"));

        AlertCondition condition = AlertCondition.valueOf(request.getCondition().toUpperCase());

        PriceAlert alert = new PriceAlert();
        alert.setUser(user);
        alert.setCommodity(commodity);
        alert.setTargetPrice(request.getTargetPrice());
        alert.setCondition(condition);
        alert.setIsActive(true);
        alert.setCreatedAt(LocalDateTime.now());

        return priceAlertRepository.save(alert);
    }

    @Transactional
    public void deleteAlert(Long alertId) {
        User user = authService.getCurrentUser();
        PriceAlert alert = priceAlertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found"));

        if (!alert.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this alert");
        }

        priceAlertRepository.delete(alert);
    }
}
