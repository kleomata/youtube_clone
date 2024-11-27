package com.MusicAlpha.Music_App_Spring_Boot.configuration;


import com.MusicAlpha.Music_App_Spring_Boot.service.Impl.UserServiceImpl;
import com.MusicAlpha.Music_App_Spring_Boot.service.customer.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity(securedEnabled = true)
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Bean
    public SecurityFilterChain filterChain (HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST,"/api/user/registerUser").permitAll()
                        //.requestMatchers("/api/user").permitAll()
                        //.requestMatchers("/api/user").hasRole("USER")
                        .requestMatchers(HttpMethod.POST, "/api/user/loginUser").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/user/infoUser").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/api/user/pictureUser/*").hasRole("USER")
                        //.anyRequest().authenticated()
                        .requestMatchers(HttpMethod.POST,"/api/channel/createChannel").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/api/channel/getChannelById").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/api/channel/hasChannel").hasRole("USER")
                        .requestMatchers(HttpMethod.POST,"/api/channel/video/uploadVideo").hasRole("USER")

                        .requestMatchers(HttpMethod.GET, "/api/user/allVideos").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/api/user/videos/*").hasRole("USER")


                        .requestMatchers(HttpMethod.GET, "/api/channel/video/allVideos").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/api/channel/video/videos/*").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/api/channel/video/hashtag/similar/*").hasRole("USER")


                        .requestMatchers(HttpMethod.GET,"/api/user/channel/*").hasRole("USER")

                        // Search
                        .requestMatchers(HttpMethod.GET,"/api/user/searchSuggestions").hasRole("USER")
                        .requestMatchers(HttpMethod.GET,"/api/user/searchSuggestions/*").hasRole("USER")
                        .requestMatchers(HttpMethod.GET,"/api/user/searchResults").hasRole("USER")
                        .requestMatchers(HttpMethod.GET,"/api/user/searchResults/*").hasRole("USER")

                        // Subscription
                        .requestMatchers(HttpMethod.POST, "/api/subscription/subscribe").hasRole("USER")
                        .requestMatchers(HttpMethod.POST, "/api/subscription/unsubscribe").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/api/subscription/checkSub/*").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/api/subscription/*/subscribers").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/api/subscription/userSubChannel").hasRole("USER")

                        // Get video by id
                        .requestMatchers(HttpMethod.GET, "/api/channel/video/watch/*").hasRole("USER")

                        // Get Video by hashtag
                        .requestMatchers(HttpMethod.GET, "/api/channel/video/hashtag/*").hasRole("USER")

                        // Comment
                        .requestMatchers(HttpMethod.POST, "/api/comment/addComment").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/api/comment/allVideoComments/*").hasRole("USER")
                        // Comment Replay
                        .requestMatchers(HttpMethod.POST, "/api/comment/addReplay").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/api/comment/allReplayForComment/*").hasRole("USER")

                        // Vote Like and dislike
                        .requestMatchers(HttpMethod.POST, "/api/vote/addLike").hasRole("USER")
                        .requestMatchers(HttpMethod.POST, "/api/vote/removeLike").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/api/vote/checkLike/*").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/api/vote/*/likes").hasRole("USER")

                        .requestMatchers(HttpMethod.POST, "/api/vote/addDislike").hasRole("USER")
                        .requestMatchers(HttpMethod.POST, "/api/vote/removeDislike").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/api/vote/checkDislike/*").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/api/vote/*/dislikes").hasRole("USER")

                        // View
                        .requestMatchers(HttpMethod.POST, "/api/view/increaseViewCount").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/api/view/*/total-views").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/api/view/*/user-views").hasRole("USER")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }



    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider userAuthenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(customUserDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }

}
