package com.placemate.apprunner;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.placemate.entity.College;
import com.placemate.entity.Student;
import com.placemate.entity.SuperAdmin;
import com.placemate.helpers.Address;
import com.placemate.security.service.RefreshTokenService;
import com.placemate.service.CollegeService;
import com.placemate.service.StudentService;
import com.placemate.service.SuperAdminService;

import lombok.AllArgsConstructor;
import lombok.Data;


@Component
@Data
@AllArgsConstructor
public class CustomAppRunner implements ApplicationRunner{@Override
	public void run(ApplicationArguments args) throws Exception {
	
	}

	
	
}







