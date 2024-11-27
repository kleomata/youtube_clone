package com.MusicAlpha.Music_App_Spring_Boot.service.Impl;

import com.MusicAlpha.Music_App_Spring_Boot.dto.commentdto.AddCommentRequest;
import com.MusicAlpha.Music_App_Spring_Boot.dto.commentdto.GetCommentResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.commentdto.GetCommentVideoResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.commentdto.replaydto.AddReplayRequest;
import com.MusicAlpha.Music_App_Spring_Boot.dto.commentdto.replaydto.GetReplayResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.commentdto.replaydto.GetReplayVideoResponse;
import com.MusicAlpha.Music_App_Spring_Boot.entity.*;
import com.MusicAlpha.Music_App_Spring_Boot.repository.*;
import com.MusicAlpha.Music_App_Spring_Boot.service.CommentService;
import com.MusicAlpha.Music_App_Spring_Boot.service.customer.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private ChannelRepository channelRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ReplayRepository replayRepository;

    @Override
    public GetCommentResponse addComment(AddCommentRequest request, Authentication authentication) {
        UUID userId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();

        Video video = videoRepository.findById(request.getVideoId())
                .orElseThrow(() -> new RuntimeException("Video not found"));

        Channel channel = video.getChannel();

        //Channel channel = channelRepository.findByChannel(request.getChannel())
          //      .orElseThrow(() -> new RuntimeException("Channel not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));


        Comment comment = new Comment();
        comment.setCommentContent(request.getCommentContent());
        comment.setDateComment(LocalDateTime.now());
        comment.setUser(user);
        comment.setVideo(video);
        comment.setChannel(channel);

        commentRepository.save(comment);


        return new GetCommentResponse(comment);
    }

    @Override
    public List<GetCommentVideoResponse> getAllCommentByVideo(UUID videoId) {
        List<Comment> comments = commentRepository.findByVideoId(videoId);

        return comments.stream()
                .map(comment -> {

                    User user = comment.getUser();
                    String imageProfile = Optional.ofNullable(user.getPicture())
                            .map(img -> "/api/user/pictureUser/" + Paths.get(img).getFileName().toString())
                            .orElse(null);
                    String firstName = user.getFirstName();
                    String lastName = user.getLastName();

                    Channel channel = comment.getChannel();
                    String channelName = channel.getChannel();

                    Channel channelForUser = channelRepository.findByUserId(user.getId())
                            .orElseThrow(() -> new RuntimeException("Channel not found"));
                    String channelNameComment = channelForUser.getChannel();

                    String commentContent = comment.getCommentContent();
                    LocalDateTime dataComment = comment.getDateComment();
                    UUID commentId = comment.getId();

                    return new GetCommentVideoResponse(firstName, lastName, imageProfile, channelName, commentContent, dataComment, channelNameComment, commentId);
                }).collect(Collectors.toList());
    }

    @Override
    public GetReplayResponse addReplay(AddReplayRequest request, Authentication authentication) {
        UUID userId = ((CustomUserDetails) authentication.getPrincipal()).getUser().getId();

        Video video = videoRepository.findById(request.getVideoId())
                .orElseThrow(() -> new RuntimeException("Video not found"));

        Channel channel = video.getChannel();

        Comment comment = commentRepository.findById(request.getCommentId())
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Replay replay = new Replay();
        replay.setCommentContent(request.getCommentContent());
        replay.setDateComment(LocalDateTime.now());
        replay.setComment(comment);
        replay.setUser(user);
        replay.setChannel(channel);
        replay.setVideo(video);

        replayRepository.save(replay);

        return new GetReplayResponse(replay);

    }

    @Override
    public List<GetReplayVideoResponse> getAllReplayByCommentInVideo(UUID videoId, UUID commentId) {
        List<Replay> replays = replayRepository.findByVideoIdAndCommentId(videoId, commentId);


        return replays.stream()
                .map(replay -> {
                    User user = replay.getUser();
                    String imageProfile = Optional.ofNullable(user.getPicture())
                            .map(img -> "/api/user/pictureUser/" + Paths.get(img).getFileName().toString())
                            .orElse(null);
                    String firstName = user.getFirstName();
                    String lastName = user.getLastName();

                    Channel channel = replay.getChannel();
                    String channelName = channel.getChannel();

                    Channel channelForUserReplay = channelRepository.findByUserId(user.getId())
                            .orElseThrow(() -> new RuntimeException("Channel not found"));
                    String channelNameForUserReplay = channelForUserReplay.getChannel();

                    String commentContent = replay.getCommentContent();
                    LocalDateTime dataComment = replay.getDateComment();
                    UUID id = replay.getId();

                    //UUID commentId =

                    return new GetReplayVideoResponse(id,firstName,lastName,imageProfile,channelName,
                            channelNameForUserReplay,commentContent,dataComment);

                }).collect(Collectors.toList());

    }
}
