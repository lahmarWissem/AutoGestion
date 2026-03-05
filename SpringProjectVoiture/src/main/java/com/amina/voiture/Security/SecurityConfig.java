package com.amina.voiture.Security;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	UserDetailsService userDetailsService;

	@Autowired
	BCryptPasswordEncoder bCryptPasswordEncoder;

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailsService)
			.passwordEncoder(bCryptPasswordEncoder);
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.csrf().disable();
		http.cors();
		http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

		// Allow preflight OPTIONS requests
		http.authorizeRequests().antMatchers(HttpMethod.OPTIONS, "/**").permitAll();

		// Allow login and registration without authentication
		http.authorizeRequests().antMatchers("/users/login").permitAll();
		http.authorizeRequests().antMatchers(HttpMethod.POST, "/users/all").permitAll();
        http.authorizeRequests().antMatchers(HttpMethod.GET, "/users/api/rol").permitAll();

		// User management endpoints
		http.authorizeRequests().antMatchers(HttpMethod.POST, "/users/image/upload").permitAll();
		http.authorizeRequests().antMatchers(HttpMethod.GET, "/users/image/get/info/**").permitAll();

		http.authorizeRequests().antMatchers(HttpMethod.GET, "/users/all/**").hasAnyAuthority("ADMIN", "USER");
		http.authorizeRequests().antMatchers("/users/get/**").hasAnyAuthority("ADMIN", "USER");
		http.authorizeRequests().antMatchers("/users/update").hasAnyAuthority("ADMIN", "USER");
		http.authorizeRequests().antMatchers("/users/image/**").hasAnyAuthority("ADMIN", "USER");

		http.authorizeRequests().antMatchers("/users/api/**").hasAnyAuthority("ADMIN", "USER");

		// Voiture API endpoints
		http.authorizeRequests().antMatchers("/voitures/api/all/**").hasAnyAuthority("ADMIN", "USER");
		http.authorizeRequests().antMatchers(HttpMethod.GET, "/voitures/**").hasAnyAuthority("ADMIN", "USER");
		http.authorizeRequests().antMatchers(HttpMethod.POST, "/voitures/**").hasAuthority("ADMIN");
		http.authorizeRequests().antMatchers(HttpMethod.PUT, "/voitures/**").hasAuthority("ADMIN");
		http.authorizeRequests().antMatchers(HttpMethod.DELETE, "/voitures/**").hasAuthority("ADMIN");

		// All other requests require authentication
		http.authorizeRequests().anyRequest().authenticated();

		// Add JWT filters
		http.addFilter(new JWTAuthenticationFilter(authenticationManager()));
		http.addFilterBefore(new JWTAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class);
	}

	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(Arrays.asList("*"));
		configuration.setExposedHeaders(Arrays.asList("Authorization"));
		configuration.setAllowCredentials(true);
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
}
