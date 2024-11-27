package com.MusicAlpha.Music_App_Spring_Boot.service;

import com.MusicAlpha.Music_App_Spring_Boot.dto.hashtagdto.GetHashtagResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.videodto.GetSimilarHashtagVideosDto;
import com.MusicAlpha.Music_App_Spring_Boot.dto.videodto.GetVideoByIDResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.videodto.GetVideoResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.videodto.UploadVideoRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface VideoService {
    GetVideoResponse uploadVideo(UploadVideoRequest request, UUID userId, UUID channelId,String videoName);
    String saveVideo(MultipartFile videoName);

    List<GetVideoResponse> getAllVideoUser(UUID userId, UUID channelId);

    GetVideoByIDResponse getVideoById(UUID videoId);

    List<GetHashtagResponse> getHashtagVideo(String hashtag);


    List<GetSimilarHashtagVideosDto> getSimilarHashtagVideos(UUID videoId);

}

