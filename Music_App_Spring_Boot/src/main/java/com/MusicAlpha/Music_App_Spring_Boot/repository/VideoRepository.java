package com.MusicAlpha.Music_App_Spring_Boot.repository;

import com.MusicAlpha.Music_App_Spring_Boot.entity.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VideoRepository extends JpaRepository<Video, UUID> {
    List<Video> findByUserIdAndChannelId(UUID userId, UUID channelId);
    List<Video> findByChannelId(UUID channelId);


    ////////  Search Form /////////////////
    List<Video> findTop10ByNameSongContainingIgnoreCaseOrFullNameSongContainingIgnoreCaseOrNameSingerContainingIgnoreCase(
            String nameSong, String fullNameSong, String nameSinger);


    @Query("SELECT v FROM Video v " +
            "LEFT JOIN v.nameSinger ns " +
            "LEFT JOIN v.addHashtag h " +
            "LEFT JOIN v.selectHashtag s " +
            "WHERE LOWER(v.nameSong) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(v.fullNameSong) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(ns) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(v.lyrics) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(v.descriptionVideo) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(h) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(s) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(v.channel.channel) LIKE LOWER(CONCAT('%', :query, '%'))"
    )
    List<Video> searchVideo(@Param("query") String query);


    @Query("SELECT v FROM Video v " +
            "WHERE :hashtag MEMBER OF v.addHashtag " +
            "OR :hashtag MEMBER OF v.selectHashtag")
    List<Video> findVideosByHashtag(@Param("hashtag") String hashtag);

    //////////////////////
    @Query("SELECT v FROM Video v WHERE EXISTS ("+
            "SELECT h FROM v.addHashtag h WHERE h IN :hashtags) OR EXISTS ("+
            "SELECT h FROM v.selectHashtag h WHERE h IN :hashtags)")
    List<Video> findVideosBySimilarHashtags(List<String> hashtags);


}
