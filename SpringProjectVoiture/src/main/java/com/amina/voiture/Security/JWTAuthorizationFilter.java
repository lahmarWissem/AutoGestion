package com.amina.voiture.Security;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

public class JWTAuthorizationFilter extends OncePerRequestFilter {

	private static final Logger log = LoggerFactory.getLogger(JWTAuthorizationFilter.class);

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		log.info("===== JWTAuthorizationFilter =====");
		log.info("Request: {} {} from Origin: {}", request.getMethod(), request.getRequestURI(), request.getHeader("Origin"));

		// CORS is handled by SecurityConfig.corsConfigurationSource() — do NOT add headers here

		String jwt = request.getHeader("Authorization");
		log.info("Authorization header present: {}", (jwt != null));

		if (jwt == null || !jwt.startsWith(SecParams.PREFIX)) {
			log.info("No valid JWT found, continuing filter chain without authentication");
			filterChain.doFilter(request, response);

			// Log CORS headers AFTER the filter chain has processed
			log.info("AFTER filter chain - Access-Control-Allow-Origin: {}", response.getHeader("Access-Control-Allow-Origin"));
			log.info("AFTER filter chain - Response status: {}", response.getStatus());
			return;
		}

		try {
			JWTVerifier verifier = JWT.require(Algorithm.HMAC256(SecParams.SECRET)).build();
			jwt = jwt.substring(7); // Remove "Bearer " prefix

			DecodedJWT decodedJWT = verifier.verify(jwt);
			String username = decodedJWT.getSubject();
			List<String> roles = decodedJWT.getClaims().get("roles").asList(String.class);
			log.info("JWT valid for user: {}, roles: {}", username, roles);

			Collection<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
			for (String r : roles)
				authorities.add(new SimpleGrantedAuthority(r));

			UsernamePasswordAuthenticationToken user =
					new UsernamePasswordAuthenticationToken(username, null, authorities);

			SecurityContextHolder.getContext().setAuthentication(user);
			log.info("Authentication set in SecurityContext for user: {}", username);
		} catch (Exception e) {
			log.error("JWT verification FAILED: {}", e.getMessage());
		}

		filterChain.doFilter(request, response);
		log.info("AFTER filter chain - Access-Control-Allow-Origin: {}", response.getHeader("Access-Control-Allow-Origin"));
		log.info("AFTER filter chain - Response status: {}", response.getStatus());
	}
}