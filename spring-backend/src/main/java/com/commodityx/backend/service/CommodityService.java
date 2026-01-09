package com.commodityx.backend.service;

import com.commodityx.backend.model.Commodity;
import com.commodityx.backend.repository.CommodityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommodityService {

    @Autowired
    private CommodityRepository commodityRepository;

    public List<Commodity> getAllCommodities() {
        return commodityRepository.findAll();
    }

    public Commodity getCommodityById(Long id) {
        return commodityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commodity not found with id: " + id));
    }

    public Commodity getCommodityBySymbol(String symbol) {
        return commodityRepository.findBySymbol(symbol)
                .orElseThrow(() -> new RuntimeException("Commodity not found with symbol: " + symbol));
    }
}
