package com.placemate.repository.jpa;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.placemate.entity.SuperAdmin;

@Repository
public interface SuperAdminRepository extends JpaRepository<SuperAdmin, Integer>{
	
	Optional<SuperAdmin> findSuperAdminByEmailId(String emailId);
}
