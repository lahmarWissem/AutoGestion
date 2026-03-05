package com.amina.voiture.rest;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.amina.voiture.entities.Image;
import com.amina.voiture.entities.User;
import com.amina.voiture.services.ImageService;
import com.amina.voiture.services.UserService;

@RestController
@RequestMapping("/users/image")
public class UserImageRestController {

    @Autowired
    ImageService imageService;

    @Autowired
    UserService userService;
    
    // Validation constants
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final List<String> ALLOWED_TYPES = Arrays.asList(
        "image/jpeg", 
        "image/jpg", 
        "image/png", 
        "image/webp"
    );

    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file) throws IOException {
        // Validate file is not empty
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse("Le fichier est vide."));
        }
        
        // Validate file size
        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body(createErrorResponse("Le fichier est trop volumineux. Taille maximale : 5 MB."));
        }
        
        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType.toLowerCase())) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse("Type de fichier non valide. Formats acceptés : JPG, PNG, WEBP."));
        }
        
        // Validate file has an extension
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.contains(".")) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse("Le fichier doit avoir une extension valide."));
        }
        
        try {
            Image uploadedImage = imageService.uplaodImage(file);
            return ResponseEntity.ok(uploadedImage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Erreur lors du téléchargement de l'image : " + e.getMessage()));
        }
    }

    @RequestMapping(value = "/get/info/{id}", method = RequestMethod.GET)
    public Image getImageDetails(@PathVariable("id") Long id) throws IOException {
        return imageService.getImageDetails(id);
    }

    @RequestMapping(value = "/load/{id}", method = RequestMethod.GET)
    public ResponseEntity<byte[]> getImage(@PathVariable("id") Long id) throws IOException {
        return imageService.getImage(id);
    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
    public void deleteImage(@PathVariable("id") Long id) {
        imageService.deleteImage(id);
    }

    @RequestMapping(value = "/loadImageUser/{name}", method = RequestMethod.GET)
    public ResponseEntity<?> getImageByUserName(@PathVariable("name") String name) throws IOException {
        User user = userService.findUserByUsername(name);
        if (user == null || user.getImage() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(createErrorResponse("Utilisateur ou image non trouvé"));
        }
        return ResponseEntity.ok(imageService.getImageDetails(user.getImage().getIdImage()));
    }

    @RequestMapping(value = "/update", method = RequestMethod.PUT)
    public ResponseEntity<?> UpdateImage(@RequestParam("image") MultipartFile file) throws IOException {
        // Validate file is not empty
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse("Le fichier est vide."));
        }
        
        // Validate file size
        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body(createErrorResponse("Le fichier est trop volumineux. Taille maximale : 5 MB."));
        }
        
        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType.toLowerCase())) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse("Type de fichier non valide. Formats acceptés : JPG, PNG, WEBP."));
        }
        
        try {
            Image updatedImage = imageService.uplaodImage(file);
            return ResponseEntity.ok(updatedImage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Erreur lors de la mise à jour de l'image : " + e.getMessage()));
        }
    }
    
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}
