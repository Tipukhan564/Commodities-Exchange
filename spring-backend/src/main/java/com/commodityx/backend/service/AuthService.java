package com.commodityx.backend.service;

import com.commodityx.backend.dto.JwtResponse;
import com.commodityx.backend.dto.LoginRequest;
import com.commodityx.backend.dto.RegisterRequest;
import com.commodityx.backend.model.Transaction;
import com.commodityx.backend.model.User;
import com.commodityx.backend.repository.TransactionRepository;
import com.commodityx.backend.repository.UserRepository;
import com.commodityx.backend.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Transactional
    public JwtResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setBalance(new BigDecimal("100000.00"));
        user.setIsAdmin(false);
        user.setCreatedAt(LocalDateTime.now());

        user = userRepository.save(user);

        // Create initial deposit transaction
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setType("DEPOSIT");
        transaction.setAmount(new BigDecimal("100000.00"));
        transaction.setDescription("Initial deposit");
        transaction.setCreatedAt(LocalDateTime.now());
        transactionRepository.save(transaction);

        // Generate JWT token
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        return new JwtResponse(jwt, user.getId(), user.getUsername(), user.getEmail(),
                user.getFullName(), user.getBalance(), user.getIsAdmin());
    }

    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new JwtResponse(jwt, user.getId(), user.getUsername(), user.getEmail(),
                user.getFullName(), user.getBalance(), user.getIsAdmin());
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
