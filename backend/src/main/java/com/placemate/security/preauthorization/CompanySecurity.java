package com.placemate.security.preauthorization;

import org.springframework.stereotype.Component;

import com.placemate.repository.jpa.CompanyRepository;
import com.placemate.security.utils.SecurityUtils;

import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class CompanySecurity {
	
	private CompanyRepository companyRepository;
	
	public boolean isOwner(int companyId) {
		int collegeId = SecurityUtils.getCollegeId();
		return companyRepository.existsByIdAndCollegeId(companyId, collegeId);
	}
}
