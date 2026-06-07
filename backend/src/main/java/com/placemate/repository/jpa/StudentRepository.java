package com.placemate.repository.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.placemate.entity.Student;
import com.placemate.entity.enums.StudentStatus;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer>{

	Student findByRollNumberAndCollegeId(String rollNumber, int collegeId);
	
	Optional<Student> findStudentByEmailId(String emailId);
	
	Page<Student> findByRollNumberContainingIgnoreCase(String emailId, Pageable pageable);
	
	boolean existsByEmailId(String emailId);
	boolean existsByIdAndCollegeId(int id, int collegeId);
	
	List<Student> findByStatusAndCollege_Id(StudentStatus status, int collegeId);
}
