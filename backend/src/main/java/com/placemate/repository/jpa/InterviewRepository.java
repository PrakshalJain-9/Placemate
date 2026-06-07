package com.placemate.repository.jpa;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.placemate.entity.InterviewRound;

@Repository
public interface InterviewRepository extends JpaRepository<InterviewRound, Integer>{


	@Query("SELECT r FROM InterviewRound r " +
	           "WHERE r.college.id = :collegeId " +  
	           "AND (:companyId IS NULL OR r.company.id = :companyId) " + 
	           "AND LOWER(r.interviewName) LIKE LOWER(CONCAT('%', :interviewName, '%'))")
	    Page<InterviewRound> findRoundsWithOptionalFilters(@Param("collegeId") int collegeId, @Param("companyId") Integer companyId, @Param("interviewName") String interviewName,
	            Pageable pageable);	
	
	boolean existsByIdAndCollegeId(int id, int collegeId);
}
