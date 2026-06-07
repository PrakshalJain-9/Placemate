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
public class CustomAppRunner implements ApplicationRunner{

	
	private SuperAdminService superAdminService;
	private CollegeService collegeService;
	private StudentService studentService;
	private PasswordEncoder encoder;
	private CacheManager cacheManager;
	private RefreshTokenService refreshTokenService;

	public void addSuperAdminDetails() {
		Address address = Address.builder().city("Kota").country("India").state("Rajasthan").street("Raanpur").zipCode("325003").build();
				
		College college = College.builder().collegeName("iiitKota").address(address).build();
		collegeService.saveCollege(college);	
		SuperAdmin superAdmin = SuperAdmin.builder().college(college).emailId("prakshaljain99.pj@gmail.com")
								.password(encoder.encode("12345678")).role("SUPERADMIN").build();
		superAdminService.saveSuperAdmin(superAdmin);
		
		
		Student student = Student.builder().college(college).emailId("2023kucp1121@iiitkota.ac.in").name("Prakshal Jain")
				.role("ADMIN")
				.password(encoder.encode("1234"))
				.rollNumber("2023KUCP1121")
				.build();
		
		Student student2 = Student.builder().college(college).emailId("prakshaljain9.pj@gmail.com").name("PJ")
				.role("ADMIN")
				.password(encoder.encode("1234"))
				.rollNumber("2023KUCP1120")
				.build();
		
		studentService.saveStudent(student);
		studentService.saveStudent(student2);
				
	}

	
	public void deleteCache() {
		refreshTokenService.deleteAllToken();
		cacheManager.getCacheNames().forEach(cacheName -> {
			Cache cache = cacheManager.getCache(cacheName);
			cache.clear();
		});
	}
	
	@Override
	public void run(ApplicationArguments args) throws Exception {
		try {
			deleteCache();
//			addSuperAdminDetails();
		}catch(Exception e) {
			e.printStackTrace();
		}
	}
	
}







