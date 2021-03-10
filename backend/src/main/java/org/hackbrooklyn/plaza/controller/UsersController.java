package org.hackbrooklyn.plaza.controller;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.hackbrooklyn.plaza.model.User;
import org.hackbrooklyn.plaza.service.UsersService;
import org.hackbrooklyn.plaza.util.JwtUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/users")
public class UsersController {

    @Value("${JWT_COOKIE_NAME}")
    private String JWT_COOKIE_NAME;

    private final JwtUtils jwtUtils;
    private final UsersService usersService;

    public UsersController(JwtUtils jwtUtils, UsersService usersService) {
        this.jwtUtils = jwtUtils;
        this.usersService = usersService;
    }

    /**
     * Logs a user in and generates a refresh token and an access token.
     */
    @PostMapping("login")
    public ResponseEntity<Map<String, String>> login(@RequestBody @Valid LoginRequest request, HttpServletResponse response) {
        User loggedInUser = usersService.logInUser(request.getEmail(), request.getPassword());

        response.addCookie(generateJwtRefreshTokenCookie(loggedInUser));
        Map<String, String> resBody = generateJwtAccessTokenResponseBody(loggedInUser);

        return new ResponseEntity<>(resBody, HttpStatus.OK);
    }

    /**
     * Activates a user's account and generates a refresh token and an access token.
     */
    @PostMapping("activate")
    public ResponseEntity<Map<String, String>> activate(@RequestBody @Valid AccountActivationRequest request, HttpServletResponse response) {
        User activatedUser = usersService.activateUser(request.getKey(), request.getPassword());

        response.addCookie(generateJwtRefreshTokenCookie(activatedUser));
        Map<String, String> resBody = generateJwtAccessTokenResponseBody(activatedUser);

        return new ResponseEntity<>(resBody, HttpStatus.OK);
    }

    @PostMapping("activate/request")
    public ResponseEntity<Void> requestActivation(@RequestBody @Valid RequestAccountActivationRequest request) {
        usersService.requestActivation(request.getEmail());

        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     * Generates an access token for the user.
     * Accepts a refresh token in the cookie for authentication.
     */
    @PostMapping("refreshAccessToken")
    public ResponseEntity<Map<String, String>> refreshAccessToken(@AuthenticationPrincipal User user) {
        Map<String, String> resBody = generateJwtAccessTokenResponseBody(user);

        return new ResponseEntity<>(resBody, HttpStatus.OK);
    }

    private Cookie generateJwtRefreshTokenCookie(User user) {
        Cookie jwtCookie = new Cookie(JWT_COOKIE_NAME, jwtUtils.generateJwt(user, JwtUtils.JwtTypes.REFRESH));
        jwtCookie.setPath("/users/refreshAccessToken");
        jwtCookie.setHttpOnly(true);

        return jwtCookie;
    }

    private Map<String, String> generateJwtAccessTokenResponseBody(User user) {
        Map<String, String> resBody = new HashMap<>(1);
        resBody.put("token", jwtUtils.generateJwt(user, JwtUtils.JwtTypes.ACCESS));

        return resBody;
    }

    @Data
    private static class RequestAccountActivationRequest {

        @Email
        @NotBlank
        private String email;
    }

    @Data
    private static class AccountActivationRequest {

        @NotBlank
        private String key;

        @NotBlank
        private String password;
    }

    @Data
    private static class LoginRequest {

        @Email
        @NotBlank
        private String email;

        @NotBlank
        private String password;
    }
}
