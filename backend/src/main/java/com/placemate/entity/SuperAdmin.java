package com.placemate.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "superAdmin")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class SuperAdmin {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "admin_id")
	private int id;

	@OneToOne
	private College college;
	@Column(unique = true, nullable = false)
	private String emailId;
	private String password;
	private String role;
}
