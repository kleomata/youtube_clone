package com.MusicAlpha.Music_App_Spring_Boot.configuration;

import com.zaxxer.hikari.HikariDataSource;
import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

//@Configuration
public class DataSourceConfig {
  /*  @Autowired
    private HikariDataSource hikariDataSource;

    @PreDestroy
    public void closeDataSource() {
        if (hikariDataSource != null) {
            hikariDataSource.close();
            System.out.println("HikariCP DataSource is closed successfully.");
        }
    }

    @Bean
    public HikariDataSource dataSource() {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl("jdbc:mysql://localhost:3306/youtube_DB");
        dataSource.setUsername("root");
        dataSource.setPassword("root");
        dataSource.setMaximumPoolSize(20);
        //dataSource.setIdleTimeout(600000); // 10 minuta
        //dataSource.setMaxLifetime(1800000); // 30 minuta
        //dataSource.setConnectionTimeout(30000); // 30 sekonda
        dataSource.setAutoCommit(false); // Ndalohet auto-commit
        return dataSource;
    }
*/
}
