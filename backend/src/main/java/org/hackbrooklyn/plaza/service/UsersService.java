package org.hackbrooklyn.plaza.service;

import org.hackbrooklyn.plaza.dto.TokenDTO;
import org.hackbrooklyn.plaza.dto.UserDataDTO;
import org.hackbrooklyn.plaza.model.User;
import org.springframework.security.authentication.BadCredentialsException;

public interface UsersService {

    User logInUser(String email, String password) throws BadCredentialsException;

    void addRefreshTokenToBlocklist(String refreshToken);

    TokenDTO activateUser(String key, String password);

    void requestActivation(String email);

    TokenDTO resetPassword(String key, String password);

    void requestPasswordReset(String email);

    TokenDTO refreshAccessToken(String refreshToken, User refreshingUser);

    UserDataDTO getUserData(User user);
}
