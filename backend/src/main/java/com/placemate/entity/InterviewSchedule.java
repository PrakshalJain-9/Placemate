package com.placemate.entity;

import java.time.LocalDateTime;

import com.placemate.entity.enums.InterviewStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "interview_schedule")
public class InterviewSchedule {
	
	@Id
	@Column(name = "interview_schedule_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "interview_id")
	private InterviewRound interviewRound;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "student_id")
	private Student student;
	
	@Column(name = "startTime")
	private LocalDateTime startTime;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "assigned_room")
	private Room room;
	
	
	@Enumerated(EnumType.STRING)
	private InterviewStatus status;
	
	@Version	
	private Long version;
}
