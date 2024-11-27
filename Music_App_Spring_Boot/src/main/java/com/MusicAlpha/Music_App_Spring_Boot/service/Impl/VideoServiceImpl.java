package com.MusicAlpha.Music_App_Spring_Boot.service.Impl;

import com.MusicAlpha.Music_App_Spring_Boot.dto.hashtagdto.GetHashtagResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.videodto.GetSimilarHashtagVideosDto;
import com.MusicAlpha.Music_App_Spring_Boot.dto.videodto.GetVideoByIDResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.videodto.GetVideoResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.videodto.UploadVideoRequest;
import com.MusicAlpha.Music_App_Spring_Boot.entity.Channel;
import com.MusicAlpha.Music_App_Spring_Boot.entity.User;
import com.MusicAlpha.Music_App_Spring_Boot.entity.Video;
import com.MusicAlpha.Music_App_Spring_Boot.repository.*;
import com.MusicAlpha.Music_App_Spring_Boot.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class VideoServiceImpl implements VideoService {

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChannelRepository channelRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private ViewRepository viewRepository;

    @Override
    public GetVideoResponse uploadVideo(UploadVideoRequest request, UUID userId, UUID channelId,String videoName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Channel channel = channelRepository.findById(channelId)
                .orElseThrow(() -> new RuntimeException("Channel not found"));


        Video video = new Video();
        video.setNameSong(request.getNameSong());
        video.setFullNameSong(request.getFullNameSong());
        video.setNameSinger(request.getNameSinger());
        video.setAddHashtag(request.getAddHashtag());
        video.setSelectHashtag(request.getSelectHashtag());
        video.setLyrics(request.getLyrics());
        video.setDescriptionVideo(request.getDescriptionVideo());

        video.setVideoName(videoName);

        video.setUser(user);
        video.setChannel(channel);

        video.setDateOfCreation(LocalDateTime.now());

        videoRepository.save(video);


        return new GetVideoResponse(video, userId, channel.getId(), videoName);
    }

    private final String UPLOAD_DIR = "/home/kmata/Desktop/MusicAppProject/Videos/";



    @Override
    public String saveVideo(MultipartFile videoName) {
        String videoPaths = null;

        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));
        } catch (IOException e) {
            e.printStackTrace();
        }
        if (videoName != null && !videoName.isEmpty()) {
            Path filePath = Paths.get((UPLOAD_DIR)+videoName.getOriginalFilename());

            try {
                Files.copy(videoName.getInputStream(), filePath);
                videoPaths = filePath.toString();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return videoPaths;
    }

    @Override
    public List<GetVideoResponse> getAllVideoUser(UUID userId, UUID channelId) {
        List<Video> videos = videoRepository.findByUserIdAndChannelId(userId, channelId);

        return videos.stream()
            .map(video -> {
                String videosName = Optional.ofNullable(video.getVideoName())
                        .map(vid -> "/api/channel/video/videoName" + Paths.get(vid).getFileName().toString())
                        .orElse(null);


                return new GetVideoResponse(video, videosName);


            }).collect(Collectors.toList());
    }

    @Override
    public GetVideoByIDResponse getVideoById(UUID videoId) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        User user = video.getUser();
        Channel channel = video.getChannel();
        UUID channelId = channel.getId();

        // User info
        String imageProfile = Optional.ofNullable(user.getPicture())
                .map(img -> "/api/user/pictureUser/" + Paths.get(img).getFileName().toString())
                .orElse(null);
        String firstName = user.getFirstName();
        String lastName = user.getLastName();

        // Channel info
        String channelName = channel.getChannel();

        // Subscribe channel
        Integer countSubscribe = subscriptionRepository.countByChannel(channel);


        // Video info
        String videoName = Optional.ofNullable(video.getVideoName())
                .map(vid -> "/api/user/videos/" + Paths.get(vid).getFileName().toString())
                .orElse(null);

        String nameSong = video.getNameSong();
        String fullNameSong = video.getFullNameSong();
        LocalDateTime dateOfCreation = video.getDateOfCreation();
        String lyrics = video.getLyrics();
        String descriptionVideo = video.getDescriptionVideo();

        List<String> nameSinger = video.getNameSinger()
                .stream().toList();
        List<String> addHashtag = video.getAddHashtag()
                .stream().toList();
        List<String> selectHashtag = video.getSelectHashtag()
                .stream().toList();

        return new GetVideoByIDResponse(
                firstName, lastName, imageProfile, channelName, countSubscribe, videoName,
                nameSong,fullNameSong, dateOfCreation, lyrics, descriptionVideo, nameSinger,
                addHashtag, selectHashtag, channelId, videoId
        );

    }

    @Override
    public List<GetHashtagResponse> getHashtagVideo(String hashtag) {
        List<Video> videos = videoRepository.findVideosByHashtag(hashtag);

        return videos.stream()
                .map(video -> {
                    UUID videoId = video.getId();
                    String videoName = Optional.ofNullable(video.getVideoName())
                            .map(vid -> "/api/user/videos/" + Paths.get(vid).getFileName().toString())
                            .orElse(null);
                    String fullNameSong = video.getFullNameSong();
                    LocalDateTime dateOfCreation = video.getDateOfCreation();

                    User user = video.getUser();
                    String imageProfile = Optional.ofNullable(user.getPicture())
                            .map(img -> "/api/user/pictureUser/" + Paths.get(img).getFileName().toString())
                            .orElse(null);

                    Channel channel = video.getChannel();
                    String nameChannel = channel.getChannel();

                    return new GetHashtagResponse(videoId, videoName, fullNameSong, dateOfCreation,
                                                imageProfile, nameChannel);
                }).collect(Collectors.toList());

    }


    ///
    @Override
    public List<GetSimilarHashtagVideosDto> getSimilarHashtagVideos(UUID videoId) {
        Video videoCurrent = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        List<String> currentHashtags = videoCurrent.getAddHashtag();
        currentHashtags.addAll(videoCurrent.getSelectHashtag());

        List<Video> videos = videoRepository.findVideosBySimilarHashtags(currentHashtags);

        return videos.stream()
                .map(video -> {

                    UUID videoIdSelect = video.getId();

                    String fullNameSong = video.getFullNameSong();
                    LocalDateTime dateOfCreation = video.getDateOfCreation();

                    String videoName = Optional.ofNullable(video.getVideoName())
                            .map(vid -> "/api/user/videos/" + Paths.get(vid).getFileName().toString())
                            .orElse(null);

                    Channel channel = video.getChannel();
                    String channelName = channel.getChannel();

                    User user = video.getUser();
                    String imageName = Optional.ofNullable(user.getPicture())
                            .map(img -> "/api/user/pictureUser/" + Paths.get(img).getFileName().toString())
                            .orElse(null);

                    Optional<Long> viewCountOptional = viewRepository.getTotalViewCountFromVideo(video.getId());
                    Long viewCount = viewCountOptional.orElse(0L);

                    List<String> addHashtag = video.getAddHashtag()
                            .stream().toList();
                    List<String> selectHashtag = video.getSelectHashtag()
                            .stream().toList();

                    return new GetSimilarHashtagVideosDto(videoIdSelect, fullNameSong, dateOfCreation, videoName,
                            viewCount, imageName, channelName, addHashtag, selectHashtag);

                }).collect(Collectors.toList());

    }


}
