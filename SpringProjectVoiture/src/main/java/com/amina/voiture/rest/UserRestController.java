package com.amina.voiture.rest;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


import com.amina.voiture.entities.User;
import com.amina.voiture.repos.UserRepository;
import com.amina.voiture.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/users")
public class UserRestController {
	
	@Autowired
	UserRepository userRep;
	@Autowired
	UserService userService;
	
	@Autowired
	BCryptPasswordEncoder bCryptPasswordEncoder;
	
	@RequestMapping(path ="all",method = RequestMethod.GET)
	public List<User> getAllUsers() {
		return userRep.findAll();
	 }
	
	 @RequestMapping(value ="/{username}",method = RequestMethod.GET)
	    public User getUserByUsernamePassword(@PathVariable("username") String username) {
	        return userRep.findByUsername(username);
	    }
	 
	 @RequestMapping(value ="/get/{id}",method = RequestMethod.GET)
	    public User getUser(@PathVariable("id") Long id) {
	        return userService.getUser(id);
	    }



	@RequestMapping(path="all",method = RequestMethod.POST)
    public ResponseEntity<?> addNewUserToDataBase(@RequestBody User user) {
        // Check if user already exists
        User existingUser = userService.findUserByUsername(user.getUsername());
        if (existingUser != null) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Cet identifiant est déjà utilisé.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }

        System.out.println(user.getUsername());
        
        User savedUser = userService.saveUser(user);
        return ResponseEntity.ok(savedUser);
    }
	   @RequestMapping(path="update",method = RequestMethod.PUT)
	    public User UPDATEUSER (@RequestBody User user) {
	        System.out.println(user.getUsername());
	        if(user.getRoles() != null && !user.getRoles().isEmpty()) {
	            System.out.println(user.getRoles().get(0).getRole());
	        }
	        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
	        return userRep.save(user);
	    }
	   
	   
		@RequestMapping(value="/all/{id}",method = RequestMethod.DELETE)
		public void deleteProduit(@PathVariable("id") Long id)
		{
		    userService.deleteUserById(id);
		}
	

 
}
