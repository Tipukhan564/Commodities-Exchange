package com.commodityx.backend.service;

import com.commodityx.backend.dto.OrderRequest;
import com.commodityx.backend.model.*;
import com.commodityx.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TradingService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private CommodityRepository commodityRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @Transactional
    public Order placeOrder(OrderRequest request) {
        User user = authService.getCurrentUser();
        Commodity commodity = commodityRepository.findById(request.getCommodityId())
                .orElseThrow(() -> new RuntimeException("Commodity not found"));

        OrderType orderType = OrderType.valueOf(request.getOrderType().toUpperCase());
        BigDecimal totalCost = request.getQuantity().multiply(request.getPrice());

        // Validate order
        if (orderType == OrderType.BUY) {
            if (user.getBalance().compareTo(totalCost) < 0) {
                throw new RuntimeException("Insufficient balance");
            }
        } else if (orderType == OrderType.SELL) {
            Portfolio portfolio = portfolioRepository.findByUserAndCommodity(user, commodity)
                    .orElseThrow(() -> new RuntimeException("No holdings found for this commodity"));

            if (portfolio.getQuantity().compareTo(request.getQuantity()) < 0) {
                throw new RuntimeException("Insufficient quantity to sell");
            }
        }

        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setCommodity(commodity);
        order.setOrderType(orderType);
        order.setQuantity(request.getQuantity());
        order.setPrice(request.getPrice());
        order.setStatus(OrderStatus.COMPLETED);
        order.setCreatedAt(LocalDateTime.now());
        order = orderRepository.save(order);

        // Update user balance and portfolio
        if (orderType == OrderType.BUY) {
            user.setBalance(user.getBalance().subtract(totalCost));
            userRepository.save(user);

            // Update or create portfolio entry
            Portfolio portfolio = portfolioRepository.findByUserAndCommodity(user, commodity)
                    .orElse(new Portfolio());

            if (portfolio.getId() == null) {
                portfolio.setUser(user);
                portfolio.setCommodity(commodity);
                portfolio.setQuantity(request.getQuantity());
                portfolio.setAveragePrice(request.getPrice());
            } else {
                BigDecimal totalValue = portfolio.getQuantity().multiply(portfolio.getAveragePrice())
                        .add(totalCost);
                BigDecimal newQuantity = portfolio.getQuantity().add(request.getQuantity());
                portfolio.setQuantity(newQuantity);
                portfolio.setAveragePrice(totalValue.divide(newQuantity, 2, BigDecimal.ROUND_HALF_UP));
            }
            portfolioRepository.save(portfolio);

            // Create transaction
            Transaction transaction = new Transaction();
            transaction.setUser(user);
            transaction.setType("BUY");
            transaction.setAmount(totalCost.negate());
            transaction.setDescription("Bought " + request.getQuantity() + " " + commodity.getName());
            transaction.setCreatedAt(LocalDateTime.now());
            transactionRepository.save(transaction);

        } else { // SELL
            user.setBalance(user.getBalance().add(totalCost));
            userRepository.save(user);

            // Update portfolio
            Portfolio portfolio = portfolioRepository.findByUserAndCommodity(user, commodity)
                    .orElseThrow(() -> new RuntimeException("No holdings found"));

            portfolio.setQuantity(portfolio.getQuantity().subtract(request.getQuantity()));

            if (portfolio.getQuantity().compareTo(BigDecimal.ZERO) == 0) {
                portfolioRepository.delete(portfolio);
            } else {
                portfolioRepository.save(portfolio);
            }

            // Create transaction
            Transaction transaction = new Transaction();
            transaction.setUser(user);
            transaction.setType("SELL");
            transaction.setAmount(totalCost);
            transaction.setDescription("Sold " + request.getQuantity() + " " + commodity.getName());
            transaction.setCreatedAt(LocalDateTime.now());
            transactionRepository.save(transaction);
        }

        return order;
    }

    public List<Order> getUserOrders() {
        User user = authService.getCurrentUser();
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Portfolio> getUserPortfolio() {
        User user = authService.getCurrentUser();
        return portfolioRepository.findByUser(user);
    }

    @Transactional
    public void cancelOrder(Long orderId) {
        User user = authService.getCurrentUser();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to cancel this order");
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Only pending orders can be cancelled");
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }
}
