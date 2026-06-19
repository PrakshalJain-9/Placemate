package com.placemate.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.placemate.security.utils.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ServerSentEventService {

	private Map<Integer, CopyOnWriteArrayList<SseEmitter>> emittersMap = new ConcurrentHashMap<>();
	
	public SseEmitter addEmitter() {
		int collegeId = SecurityUtils.getCollegeId();
		
		SseEmitter sseEmiter = new SseEmitter(24*60*60*1000L);
		sseEmiter.onCompletion(() -> emittersMap.get(collegeId).remove(sseEmiter));
		sseEmiter.onTimeout(() -> emittersMap.get(collegeId).remove(sseEmiter));
		emittersMap.computeIfAbsent(collegeId, k -> new CopyOnWriteArrayList<>()).add(sseEmiter);
		
		return sseEmiter;
	}
	
	public void broadcastToCollege(Object object, String name, int collegeId) {
		List<SseEmitter> emitters = emittersMap.get(collegeId);
		if(emitters == null) return;
		List<SseEmitter> deadEmitters = new ArrayList<>();
		emitters.forEach((emitter) -> {
			try {
				emitter.send(SseEmitter.event()
										.name(name)
										.data(object));
			} catch (IOException e) {
				deadEmitters.add(emitter);
			}
									
		});
		
		emitters.removeAll(deadEmitters);
	}
	
}
