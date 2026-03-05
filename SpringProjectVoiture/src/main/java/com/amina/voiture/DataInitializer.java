package com.amina.voiture;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.amina.voiture.entities.Modele;
import com.amina.voiture.entities.Role;
import com.amina.voiture.entities.User;
import com.amina.voiture.entities.Voiture;
import com.amina.voiture.repos.ModeleRepository;
import com.amina.voiture.repos.RoleRepository;
import com.amina.voiture.repos.UserRepository;
import com.amina.voiture.repos.VoitureRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModeleRepository modelesRepository;

    @Autowired
    private VoitureRepository voitureRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Only seed if the database is empty
        if (roleRepository.count() > 0) {
            System.out.println("Database already seeded, skipping initialization.");
            return;
        }

        System.out.println("=== Seeding database with demo data ===");

        // 1. Create Roles
        Role adminRole = new Role();
        adminRole.setRole("ADMIN");
        adminRole = roleRepository.save(adminRole);

        Role userRole = new Role();
        userRole.setRole("USER");
        userRole = roleRepository.save(userRole);

        System.out.println("Roles created: ADMIN, USER");

        // 2. Create Users
        User adminUser = new User();
        adminUser.setUsername("admin");
        adminUser.setPassword(bCryptPasswordEncoder.encode("admin123"));
        adminUser.setEnabled(true);
        adminUser.setRoles(Arrays.asList(adminRole));
        userRepository.save(adminUser);

        User normalUser = new User();
        normalUser.setUsername("amina");
        normalUser.setPassword(bCryptPasswordEncoder.encode("amina123"));
        normalUser.setEnabled(true);
        normalUser.setRoles(Arrays.asList(userRole));
        userRepository.save(normalUser);

        System.out.println("Users created: admin (ADMIN), amina (USER)");

        // 3. Create Modeles
        Modele suv = new Modele();
        suv.setNomMod("SUV");
        suv.setDescriptionMod("Sport Utility Vehicle");
        suv = modelesRepository.save(suv);

        Modele berline = new Modele();
        berline.setNomMod("Berline");
        berline.setDescriptionMod("Voiture berline classique");
        berline = modelesRepository.save(berline);

        Modele sport = new Modele();
        sport.setNomMod("Sport");
        sport.setDescriptionMod("Voiture sportive haute performance");
        sport = modelesRepository.save(sport);

        System.out.println("Modeles created: SUV, Berline, Sport");

        // 4. Create Voitures
        Voiture v1 = new Voiture();
        v1.setNomVoiture("Toyota RAV4");
        v1.setPrixVoiture(85000.0);
        v1.setDateCreation(new Date());
        v1.setType("selling");
        v1.setPosition(1);
        v1.setModele(suv);
        voitureRepository.save(v1);

        Voiture v2 = new Voiture();
        v2.setNomVoiture("BMW Serie 3");
        v2.setPrixVoiture(120000.0);
        v2.setDateCreation(new Date());
        v2.setType("selling");
        v2.setPosition(2);
        v2.setModele(berline);
        voitureRepository.save(v2);

        Voiture v3 = new Voiture();
        v3.setNomVoiture("Porsche 911");
        v3.setPrixVoiture(350000.0);
        v3.setDateCreation(new Date());
        v3.setType("selling");
        v3.setPosition(3);
        v3.setModele(sport);
        voitureRepository.save(v3);

        Voiture v4 = new Voiture();
        v4.setNomVoiture("Mercedes Classe C");
        v4.setPrixVoiture(95000.0);
        v4.setDateCreation(new Date());
        v4.setType("sold");
        v4.setPosition(4);
        v4.setModele(berline);
        voitureRepository.save(v4);

        System.out.println("Voitures created: Toyota RAV4, BMW Serie 3, Porsche 911, Mercedes Classe C");
        System.out.println("=== Database seeding complete ===");
    }
}
