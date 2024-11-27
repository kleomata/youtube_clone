package com.MusicAlpha.Music_App_Spring_Boot.service;

import com.MusicAlpha.Music_App_Spring_Boot.dto.channelInUserdto.GetInfoChannelResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.userdto.GetUserResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.userdto.LoginUserRequest;
import com.MusicAlpha.Music_App_Spring_Boot.dto.userdto.RegisterUserRequest;
import com.MusicAlpha.Music_App_Spring_Boot.dto.videodto.GetAllVideoResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.videodto.GetSearchVideoResponse;
import com.MusicAlpha.Music_App_Spring_Boot.dto.videodto.GetVideoResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface UserService {
    GetUserResponse registerUser(RegisterUserRequest request, String picture);

    GetUserResponse loginUser(LoginUserRequest request);

    String generateToken(UUID id);

    String saveImageProfile(MultipartFile picture);

    GetUserResponse getUserById(UUID id);


    List<GetAllVideoResponse> getAllVideo();

    GetInfoChannelResponse getChannel(String channelName);

    ///////
    //Video Search
    /////
    List<GetSearchVideoResponse> getSearchSuggestions(String query);
    List<GetSearchVideoResponse> getSearchResults(String query);


}