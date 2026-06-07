package com.placemate.helpers;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
@Builder
public class Address {
	
	private String street;
	private String city;
	private String state;
	private String country;
	private String zipCode;

}
