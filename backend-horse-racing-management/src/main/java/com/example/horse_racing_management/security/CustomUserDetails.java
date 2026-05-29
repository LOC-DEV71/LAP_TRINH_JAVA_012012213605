package com.example.horse_racing_management.security;

import com.example.horse_racing_management.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Getter
@AllArgsConstructor
public class CustomUserDetails implements UserDetails {
    private String username;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;

    public static CustomUserDetails build(User user) {
        // Chuyển đổi role của user thành GrantedAuthority
        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole());
        return new CustomUserDetails(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(authority)
        );
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}