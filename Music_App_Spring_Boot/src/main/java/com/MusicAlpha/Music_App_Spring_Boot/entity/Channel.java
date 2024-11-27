package com.MusicAlpha.Music_App_Spring_Boot.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
public class Channel {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, name = "channel", unique = true)
    private String channel;

    @OneToOne
    @JoinColumn(nullable = false, referencedColumnName = "id", name = "user_id")
    private User user;


}
