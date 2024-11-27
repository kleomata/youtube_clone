package com.MusicAlpha.Music_App_Spring_Boot.service.Impl;

import com.MusicAlpha.Music_App_Spring_Boot.Util.JwtUtil;
import com.MusicAlpha.Music_App_Spring_Boot.dto.channelInUserdto.GetInfoChannelResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.channelInUserdto.GetMoreVideoForChannelResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.userdto.GetUserResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.userdto.LoginUserRequest;
import com.MusicAlpha.Music_App_Spring_Boot.dto.userdto.RegisterUserRequest;
import com.MusicAlpha.Music_App_Spring_Boot.dto.videodto.GetAllVideoResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.videodto.GetSearchVideoResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.videodto.GetVideoResponse;
import com.MusicAlpha.Music_App_Spring_Boot.entity.Channel;
import com.MusicAlpha.Music_App_Spring_Boot.entity.Role;
import com.MusicAlpha.Music_App_Spring_Boot.entity.User;
import com.MusicAlpha.Music_App_Spring_Boot.entity.Video;
import com.MusicAlpha.Music_App_Spring_Boot.repository.ChannelRepository;
import com.MusicAlpha.Music_App_Spring_Boot.repository.UserRepository;
import com.MusicAlpha.Music_App_Spring_Boot.repository.VideoRepository;
import com.MusicAlpha.Music_App_Spring_Boot.service.UserService;
import com.MusicAlpha.Music_App_Spring_Boot.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private ChannelRepository channelRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public String generateToken(UUID id) {
        return jwtUtil.generateToken(id);
    }

    private final String UPLOAD_DIR = "/home/kmata/Desktop/MusicAppProject/Profile/";

    @Override
    public String saveImageProfile(MultipartFile picture) {
        String imagePath = null;

        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));
        } catch (IOException e) {
            e.printStackTrace();
        }

        if (picture != null && !picture.isEmpty()) {
            Path filePath = Paths.get((UPLOAD_DIR) + picture.getOriginalFilename());

            try {
                Files.copy(picture.getInputStream(), filePath);
                imagePath = filePath.toString();
                System.out.println("Save image: " + imagePath);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return imagePath;
    }

    @Override
    public GetUserResponse getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String profile = Optional.ofNullable(user.getPicture())
                .map(img -> "/api/user/pictureUser/" + Paths.get(img).getFileName().toString())
                .orElse(null);

        return new GetUserResponse(user, profile);
    }

    /// Get All Video for All User
    @Override
    public List<GetAllVideoResponse> getAllVideo() {
        List<Video> videos = videoRepository.findAll();

        return videos.stream()
                .map(video -> {

                    String vieoName = Optional.ofNullable(video.getVideoName())
                            .map(vid -> "/api/user/videos/" + Paths.get(vid).getFileName().toString())
                            .orElse(null);

                    User user = video.getUser();
                    String imageProfile = Optional.ofNullable(user.getPicture())
                            .map(img -> "/api/user/pictureUser/" + Paths.get(img).getFileName().toString())
                            .orElse(null);

                    Channel channel = video.getChannel();
                    String channelName = Optional.ofNullable(channel.getChannel())
                            .orElse("Default Channel Name");

                    return new GetAllVideoResponse(video, vieoName, imageProfile, channelName);

                }) .collect(Collectors.toList());
    }


    @Override
    public GetUserResponse registerUser(RegisterUserRequest request, String picture) {

        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setCountry(request.getCountry());
        user.setState(request.getState());
        user.setCity(request.getCity());
        user.setSpecificAddress(request.getSpecificAddress());
        user.setGender(request.getGender());

        user.setBirthdate(request.getBirthdate());

        user.setRole(Role.ROLE_USER);

        String encryptedPassword = passwordEncoder.encode(request.getPassword());
        user.setPassword(encryptedPassword);

        if (picture != null && !picture.isEmpty()) {
            user.setPicture(picture);
        }

        user.setUsername(request.getUsername());

        try {
            User registerUser = userRepository.save(user);
            System.out.println("Save with ID: " + registerUser.getId());

            GetUserResponse response = new GetUserResponse();
            response.setId(registerUser.getId());
            response.setFirstName(registerUser.getFirstName());
            response.setLastName(registerUser.getLastName());
            response.setBirthdate(registerUser.getBirthdate());
            response.setEmail(registerUser.getEmail());
            response.setPhone(registerUser.getPhone());
            response.setCountry(registerUser.getCountry());
            response.setState(registerUser.getState());
            response.setCity(registerUser.getCity());
            response.setSpecificAddress(registerUser.getSpecificAddress());
            response.setPicture(registerUser.getPicture());
            response.setUsername(registerUser.getUsername());
            response.setGender(registerUser.getGender());

            return response;
        } catch (Exception e) {
            System.out.println("Error " + e.getMessage());
            return null;
        }

    }

    @Override
    public GetUserResponse loginUser(LoginUserRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not Found"));

        //if (!request.getUsername().equals(user.getUsername())) {
            //throw new RuntimeException("Invalid Username!");
        //}

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        String token = jwtUtil.generateToken(user.getId());

        return mapUserToGetUserResponse(user, token);
    }

    private GetUserResponse mapUserToGetUserResponse(User user, String token) {
        GetUserResponse response = new GetUserResponse();

        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setBirthdate(user.getBirthdate());
        response.setEmail(user.getEmail());
        response.setGender(user.getGender());
        response.setPhone(user.getPhone());
        response.setCountry(user.getCountry());
        response.setState(user.getState());
        response.setCity(user.getCity());
        response.setSpecificAddress(user.getSpecificAddress());
        response.setPicture(user.getPicture());
        response.setUsername(user.getUsername());




        response.setToken(token);

        return response;
    }


    @Override
    public GetInfoChannelResponse getChannel(String channelName) {
        Channel channel = channelRepository.findByChannel(channelName)
                .orElseThrow(() -> new RuntimeException("Channel not found"));

        UUID channelId = channel.getId();

        User user = channel.getUser();
        String imageProfile = Optional.ofNullable(user.getPicture())
                .map(img -> "/api/user/pictureUser/" + Paths.get(img).getFileName().toString())
                .orElse(null);
        String firstName = Optional.ofNullable(user.getFirstName())
                .orElse("Default first name");
        String lastName = Optional.ofNullable(user.getLastName())
                .orElse("Default last name");

        List<Video> videos = videoRepository.findByChannelId(channel.getId());

        List<GetMoreVideoForChannelResponse> videoForChannel = videos.stream()
                .map(video -> {
                    //GetMoreVideoForChannelResponse videoResponse = new GetMoreVideoForChannelResponse();
                    UUID videoId = video.getId();

                    String videoName = Optional.ofNullable(video.getVideoName())
                            .map(vid -> "/api/user/videos/" + Paths.get(vid).getFileName().toString())
                            .orElse(null);

                    LocalDateTime date = video.getDateOfCreation();

                    String fullName = Optional.ofNullable(video.getFullNameSong())
                            .orElse("Null");

                    return new GetMoreVideoForChannelResponse(fullName, date, videoName, videoId);
                })
                .toList();

        return new GetInfoChannelResponse(channelId, firstName, lastName, imageProfile ,channelName, videoForChannel);
    }


    // Search
    ////
    @Override
    public List<GetSearchVideoResponse> getSearchSuggestions(String query) {
        List<Video> videos = videoRepository.findTop10ByNameSongContainingIgnoreCaseOrFullNameSongContainingIgnoreCaseOrNameSingerContainingIgnoreCase(
                query, query, query
        );


        return videos.stream()
                .map(video -> {

                    String videName = Optional.ofNullable(video.getVideoName())
                            .map(vid -> "/api/user/videos/" + Paths.get(vid).getFileName().toString())
                            .orElse(null);

                    User user = userRepository.findById(video.getUser().getId())
                            .orElse(null);
                    String userImage = Optional.ofNullable(user)
                            .map(User::getPicture)
                            .map(img -> "/api/user/pictureUser/" + Paths.get(img).getFileName().toString())
                            .orElse(null);

                    Channel channel = Optional.ofNullable(video.getChannel())
                            .flatMap(ch -> channelRepository.findById(ch.getId()))
                            .orElse(null);

                    String channelName = (channel != null) ? channel.getChannel() : null;


                    return new GetSearchVideoResponse(
                            video.getId(),
                            video.getNameSong(),
                            video.getFullNameSong(),
                            video.getDescriptionVideo(),
                            video.getNameSinger(),
                            video.getAddHashtag(),
                            video.getSelectHashtag(),
                            video.getDateOfCreation(),
                            videName,
                            //video.getUser().getId(),
                            //video.getChannel().getId(),
                            userImage,
                            channelName
                    );
                }).collect(Collectors.toList());
    }

    @Override
    public List<GetSearchVideoResponse> getSearchResults(String query) {
        List<Video> videos = videoRepository.searchVideo(query);

        return videos.stream()
                .map(video -> {

                    String videName = Optional.ofNullable(video.getVideoName())
                            .map(vid -> "/api/user/videos/" + Paths.get(vid).getFileName().toString())
                            .orElse(null);

                    User user = userRepository.findById(video.getUser().getId())
                            .orElse(null);
                    String userImage = Optional.ofNullable(user)
                            .map(User::getPicture)
                            .map(img -> "/api/user/pictureUser/" + Paths.get(img).getFileName().toString())
                            .orElse(null);

                    Channel channel = Optional.ofNullable(video.getChannel())
                            .flatMap(ch -> channelRepository.findById(ch.getId()))
                            .orElse(null);

                    String channelName = (channel != null) ? channel.getChannel() : null;


                    return new GetSearchVideoResponse(
                            video.getId(),
                            video.getNameSong(),
                            video.getFullNameSong(),
                            video.getDescriptionVideo(),
                            video.getNameSinger(),
                            video.getAddHashtag(),
                            video.getSelectHashtag(),
                            video.getDateOfCreation(),
                            videName,
                            //video.getUser().getId(),
                            //video.getChannel().getId(),
                            userImage,
                            channelName
                    );
                }).collect(Collectors.toList());
    }


    ///
    ///


}
