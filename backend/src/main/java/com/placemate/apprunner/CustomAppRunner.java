package com.placemate.apprunner;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Data;


@Component
@Data
@AllArgsConstructor
public class CustomAppRunner implements ApplicationRunner{@Override
	public void run(ApplicationArguments args) throws Exception {
		
}
	
}







