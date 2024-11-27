package com.MusicAlpha.Music_App_Spring_Boot.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
public class Likes {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(nullable = false, referencedColumnName = "id", name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(nullable = false, referencedColumnName = "id", name = "video_id")
    private Video video;

    @Column(nullable = false, name = "dateLike")
    private LocalDateTime dateLike;

}
