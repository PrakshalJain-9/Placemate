package com.placemate.dto;

import lombok.Builder;
import lombok.With;

public class AddressDTOs {
	
	@Builder
	@With
	public record AddressDetailDTO(String street, String state, String city, String zipCode, String country) {}
	
}
