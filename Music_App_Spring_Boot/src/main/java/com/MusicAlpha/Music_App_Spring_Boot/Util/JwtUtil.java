package com.MusicAlpha.Music_App_Spring_Boot.Util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.UUID;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    public String generateToken(UUID id) {
        return Jwts.builder()
                .setSubject(id.toString())
                .setIssuedAt(new Date())
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
    }

    public UUID extractId(String token) {
        return UUID.fromString(extractClaims(token).getSubject());
    }

   // public boolean isTokenValid(String token, UUID id){
     //   final UUID extractId = extractId(token);
       // return extractId.equals(id);
    //}

   // public boolean isTokenExpired(String token) {
        //return extractClaims(token).getExpiration().before(new Date());
     //   return true;
    //}

    public boolean isTokenValid(String token, UUID id) {
        final UUID extractId = extractId(token);
        return extractId.equals(id);// && !isTokenExpired(token);
    }
}
