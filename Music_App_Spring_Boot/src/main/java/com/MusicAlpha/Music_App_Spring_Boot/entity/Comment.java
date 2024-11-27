package com.MusicAlpha.Music_App_Spring_Boot.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
public class Comment {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, name = "commentContent", columnDefinition = "VARCHAR(5000)")
    private String commentContent;

    @Column(nullable = false, name = "dateComment")
    private LocalDateTime dateComment;

    @ManyToOne
    @JoinColumn(nullable = false, referencedColumnName = "channel", name = "channel_name")
    private Channel channel;

    @ManyToOne
    @JoinColumn(nullable = false, referencedColumnName = "id", name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(nullable = false, referencedColumnName = "id", name = "video_id")
    private Video video;

}
