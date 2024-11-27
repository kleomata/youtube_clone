package com.MusicAlpha.Music_App_Spring_Boot.dto.channelInUserdto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
public class GetInfoChannelResponse {

    private UUID id;
    private String firstName;
    private String lastName;
    private String picture;

    private String channelName;

    private List<GetMoreVideoForChannelResponse> video;

    public GetInfoChannelResponse(UUID id, String firstName, String lastName, String picture, String channelName, List<GetMoreVideoForChannelResponse> video) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.picture = picture;
        this.channelName = channelName;
        this.video = video;
    }
}
