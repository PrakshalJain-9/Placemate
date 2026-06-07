package com.placemate.security.core;

import java.util.Collection;
import java.util.List;

import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.placemate.entity.Student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SecurityUser implements UserDetails {
	
	public Student student;
	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(new SimpleGrantedAuthority(student.getRole()));
	}

	@Override
	public @Nullable String getPassword() {
		return student.getPassword();
	}

	@Override
	public String getUsername() {
		return student.getEmailId();
	}
	

	
}
