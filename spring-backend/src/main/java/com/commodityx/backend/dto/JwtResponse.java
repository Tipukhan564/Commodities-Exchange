package com.commodityx.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private BigDecimal balance;
    private Boolean isAdmin;

    public JwtResponse(String token, Long id, String username, String email,
                      String fullName, BigDecimal balance, Boolean isAdmin) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.balance = balance;
        this.isAdmin = isAdmin;
    }
}
