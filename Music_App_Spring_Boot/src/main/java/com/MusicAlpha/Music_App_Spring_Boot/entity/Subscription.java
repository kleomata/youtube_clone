package com.MusicAlpha.Music_App_Spring_Boot.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(nullable = false, referencedColumnName = "id", name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(nullable = false, referencedColumnName = "id", name = "channel_id")
    private Channel channel;

    @Column(nullable = false, name = "subscriptionDate")
    private LocalDateTime subscriptionDate;


    public Subscription(User user, Channel channel) {
        this.user = user;
        this.channel = channel;
        this.subscriptionDate = LocalDateTime.now();
    }

}
