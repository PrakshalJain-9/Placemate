package com.placemate.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.placemate.entity.Student;
import com.placemate.security.core.SecurityUser;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class StudentUserDetailsService implements UserDetailsService{
	
	private StudentService studentService;
	
	@Override
	public UserDetails loadUserByUsername(String emailId) throws UsernameNotFoundException {
		Student student = studentService.findStudentByEmailId(emailId);
		return new SecurityUser(student);
	}
	
	
	

}
