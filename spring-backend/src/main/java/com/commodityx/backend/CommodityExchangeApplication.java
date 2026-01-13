package com.commodityx.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class CommodityExchangeApplication {

    public static void main(String[] args) {
        SpringApplication.run(CommodityExchangeApplication.java, args);
        System.out.println("==============================================");
        System.out.println("Commodities Exchange Backend Started!");
        System.out.println("Server running on: http://localhost:5000/api");
        System.out.println("==============================================");
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
