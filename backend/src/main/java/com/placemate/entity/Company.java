package com.placemate.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
@Table(name = "company_details")
public class Company {
	
	@Id
	@Column(name = "company_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(name = "company_name", unique = true)
	private String companyName;
	
	
	@OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
	List<InterviewRound> companyRounds = new ArrayList<>();
	
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "college_id", nullable = false)
	private College college;
	
	public void addInterview(InterviewRound interviewRound) {
		companyRounds.add(interviewRound);
		interviewRound.setCompany(this);
	}
	// Add more details later like the company ctc/expected joining date for students use
	
	@Version
	private Long version;

}
