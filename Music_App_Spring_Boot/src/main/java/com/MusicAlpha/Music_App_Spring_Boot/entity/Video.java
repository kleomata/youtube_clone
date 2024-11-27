package com.MusicAlpha.Music_App_Spring_Boot.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
public class Video {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;


    @Column(nullable = false, name = "nameSong")
    private String nameSong;

    @Column(nullable = false, name = "fullNameSong")
    private String fullNameSong;

    @Column(nullable = false, name = "dateOfCreation")
    private LocalDateTime dateOfCreation;

    @Column(nullable = false, name = "videoName")
    private String videoName;

    @ElementCollection
    @CollectionTable(name = "name_singer_video")
    @Column(name = "name_singer", nullable = false)
    private List<String> nameSinger;

    @ElementCollection
    @CollectionTable(name = "add_hashtag_video")
    @Column(name = "add_hashtag", nullable = false, columnDefinition = "VARCHAR(1000)")
    private List<String> addHashtag;

    @ElementCollection
    @CollectionTable(name = "select_hashtag_video")
    @Column(name = "select_hashtag", nullable = false, columnDefinition = "VARCHAR(1000)")
    private List<String> selectHashtag;

    @Column(nullable = false, name = "lyrics", columnDefinition = "TEXT")
    private String lyrics;

    @Column(nullable = false, name = "descriptionVideo", columnDefinition = "TEXT")
    private String descriptionVideo;


    @ManyToOne
    @JoinColumn(nullable = false, referencedColumnName = "id", name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(nullable = false, referencedColumnName = "id", name = "channel_id")
    private Channel channel;
}
