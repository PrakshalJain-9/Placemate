package com.placemate.entity;

import jakarta.annotation.Nonnull;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "interview")
public class InterviewRound {

	@Id
	@Column(name = "interview_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@ManyToOne
	@JoinColumn(name = "college_id")
	private College college;
	
	@ManyToOne
	@JoinColumn(name = "company_id")
	@Nonnull
	private Company company;
	
	@Column(name = "interview_name")
	private String interviewName;
	
	@Column(name = "duration_in_minutes")
	private int durationInMinutes;

		
	@Version
	private Long version;
}






