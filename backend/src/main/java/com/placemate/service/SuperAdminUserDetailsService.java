package com.placemate.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.placemate.entity.SuperAdmin;
import com.placemate.security.core.SecuritySuperAdmin;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class SuperAdminUserDetailsService implements UserDetailsService {

	private SuperAdminService superAdminService;
	
	@Override
	public UserDetails loadUserByUsername(String emailId) throws UsernameNotFoundException {
		SuperAdmin superAdmin = superAdminService.findAdminByEmailId(emailId);
		return new SecuritySuperAdmin(superAdmin);
	}

}
