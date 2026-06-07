package com.placemate.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import com.placemate.security.filters.JwtAuthenticationFilter;
import com.placemate.security.successhandler.OAuth2SuccessHandler;
import com.placemate.service.StudentUserDetailsService;
import com.placemate.service.SuperAdminUserDetailsService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class securityConfig {
	
	
	private final StudentUserDetailsService studentDetailsService;
	private final SuperAdminUserDetailsService superAdminUserDetailsService;
	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final  PasswordEncoder passwordEncoder;
	private final OAuth2SuccessHandler successHandler;
	private final CorsConfigurationSource corsConfigurationSource;
	
	
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) {
		return http.csrf(csrf -> csrf.disable())
					.formLogin(form -> form.disable())
					.cors(cors -> cors.configurationSource(corsConfigurationSource))
					.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
					.authorizeHttpRequests(auth -> auth.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll().
							requestMatchers("/api/auth/**",  "/error/**").permitAll()
															.anyRequest().authenticated())
					.oauth2Login(config -> config.successHandler(successHandler))
					.exceptionHandling(exc -> exc.authenticationEntryPoint((request, response, exception) -> {
						response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
					}))
					.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
				.build();
	}
	
	
	
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) {
		return new ProviderManager(List.of(studentAuthenticationProvider(studentDetailsService), superAdminAuthenticationProvider(superAdminUserDetailsService)));
	}
	
	
	@Bean
	public DaoAuthenticationProvider studentAuthenticationProvider(StudentUserDetailsService userDetailService) {
		DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailService);
		provider.setPasswordEncoder(passwordEncoder);
		return provider;
	}
	
	@Bean
	public DaoAuthenticationProvider superAdminAuthenticationProvider(SuperAdminUserDetailsService userDetailsService) {
		DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
		provider.setPasswordEncoder(passwordEncoder);
		return provider;
	}
	
	
	
	
}
