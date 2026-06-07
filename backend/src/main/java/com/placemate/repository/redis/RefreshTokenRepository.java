package com.placemate.repository.redis;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.placemate.entity.RefreshToken;

@Repository
public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String>{
 
	public void deleteByToken(String token);
}
