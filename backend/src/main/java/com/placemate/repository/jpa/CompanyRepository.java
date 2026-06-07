package com.placemate.repository.jpa;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.placemate.entity.Company;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Integer>{
	
	Page<Company> findByCompanyNameContainingIgnoreCaseAndCollege_Id(String companyName,  Integer collegeId, Pageable pageable);
	boolean existsByIdAndCollegeId(int id, int collegeId);
}
