package com.placemate.events.cache;

public class CacheEvents {
	
	public record CacheEvictEvent(int studentId, int collegeId) {}
}
