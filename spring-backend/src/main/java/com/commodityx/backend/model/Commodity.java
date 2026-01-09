package com.commodityx.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "commodities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Commodity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String symbol;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "current_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal currentPrice;

    @Column(name = "price_change_24h", precision = 10, scale = 2)
    private BigDecimal priceChange24h = BigDecimal.ZERO;

    @Column(name = "high_24h", precision = 15, scale = 2)
    private BigDecimal high24h;

    @Column(name = "low_24h", precision = 15, scale = 2)
    private BigDecimal low24h;

    @Column(name = "volume_24h", precision = 20, scale = 4)
    private BigDecimal volume24h;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
