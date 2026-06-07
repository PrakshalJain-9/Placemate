package com.placemate.repository.jpa;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.placemate.entity.College;

@Repository
public interface CollegeRepository extends JpaRepository<College, Integer> {
	public Optional<College> findCollegeByCollegeName(String collegeName);
	public boolean existsById(int collegeId);
}

