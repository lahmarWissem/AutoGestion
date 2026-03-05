package com.amina.voiture.Security;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.amina.voiture.entities.User;

public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

	private static final Logger log = LoggerFactory.getLogger(JWTAuthenticationFilter.class);

	private AuthenticationManager authenticationManager;

	public JWTAuthenticationFilter(AuthenticationManager authenticationManager) {
		super();
		this.authenticationManager = authenticationManager;
		setFilterProcessesUrl("/users/login");
	}

	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
			throws AuthenticationException {

		log.info("===== JWTAuthenticationFilter - LOGIN ATTEMPT =====");
		log.info("Request: {} {} from Origin: {}", request.getMethod(), request.getRequestURI(), request.getHeader("Origin"));

		User user = null;
		try {
			user = new ObjectMapper().readValue(request.getInputStream(), User.class);
			log.info("Parsed login request for username: {}", user.getUsername());
		} catch (JsonParseException e) {
			log.error("JSON parse error: {}", e.getMessage());
		} catch (JsonMappingException e) {
			log.error("JSON mapping error: {}", e.getMessage());
		} catch (IOException e) {
			log.error("IO error reading request body: {}", e.getMessage());
		}

		if (user == null) {
			log.error("User object is NULL - could not parse request body!");
			throw new RuntimeException("Could not parse login request");
		}

		log.info("Attempting authentication for user: {}", user.getUsername());
		return authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
	}

	@Override
	protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
			Authentication authResult) throws IOException, ServletException {

		log.info("===== LOGIN SUCCESS =====");
		org.springframework.security.core.userdetails.User springUser =
				(org.springframework.security.core.userdetails.User) authResult.getPrincipal();

		List<String> roles = new ArrayList<>();
		springUser.getAuthorities().forEach(au -> {
			roles.add(au.getAuthority());
		});
		log.info("User: {}, Roles: {}", springUser.getUsername(), roles);

		String jwt = JWT.create()
				.withSubject(springUser.getUsername())
				.withArrayClaim("roles", roles.toArray(new String[roles.size()]))
				.withExpiresAt(new Date(System.currentTimeMillis() + SecParams.EXP_TIME))
				.sign(Algorithm.HMAC256(SecParams.SECRET));

		response.addHeader("Authorization", jwt);
		log.info("JWT token generated and added to Authorization header");
		log.info("Response Access-Control-Allow-Origin: {}", response.getHeader("Access-Control-Allow-Origin"));
		log.info("Response headers: {}", response.getHeaderNames());
	}

	@Override
	protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException failed) throws IOException, ServletException {
		log.error("===== LOGIN FAILED =====");
		log.error("Reason: {}", failed.getMessage());
		log.info("Response Access-Control-Allow-Origin: {}", response.getHeader("Access-Control-Allow-Origin"));
		super.unsuccessfulAuthentication(request, response, failed);
	}
}
