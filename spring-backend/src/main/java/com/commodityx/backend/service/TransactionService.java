package com.commodityx.backend.service;

import com.commodityx.backend.model.Transaction;
import com.commodityx.backend.model.User;
import com.commodityx.backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AuthService authService;

    public List<Transaction> getUserTransactions() {
        User user = authService.getCurrentUser();
        return transactionRepository.findByUserOrderByCreatedAtDesc(user);
    }
}
