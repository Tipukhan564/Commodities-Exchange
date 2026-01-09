package com.commodityx.backend.controller;

import com.commodityx.backend.model.Transaction;
import com.commodityx.backend.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<Transaction>> getUserTransactions() {
        List<Transaction> transactions = transactionService.getUserTransactions();
        return ResponseEntity.ok(transactions);
    }
}
