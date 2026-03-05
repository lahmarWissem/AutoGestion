import { ImageUser } from './../models/imageUser.model';
import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  roles!: Role[];
  newUser = new User();
  newIdRole!: number;
  newRole = new Role;
  users!: User[];
  role!: string
  uploadedImage!: File;
  image: any;
  response: any;
  err: number = 0;
  message: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.listeRoles().subscribe((mods) => {
      this.roles = mods;
      console.log(mods);
    });


  }


  addNewUser() {
    if (!this.uploadedImage) {
      this.err = 5;
      return;
    }

    this.authService
      .uploadImageUser(this.uploadedImage, this.uploadedImage.name)
      .subscribe({
        next: (response: any) => {
          this.authService
            .loadImageUserById(response.idImage)
            .subscribe((image: any) => {
              let img = new ImageUser();
              img.idImage = image.idImage;
              img.name = image.name;
              img.type = image.type;
              img.image = image.image;
              this.newUser.image = new ImageUser();
              this.newUser.image = img;
              const selectedRole = this.roles.find(r => r.role === this.role);
              if (selectedRole && selectedRole.role_id) {
                this.newUser.roles = [selectedRole];
              } else {
                this.err = 1;
                this.message = 'Erreur: Rôle invalide';
                return;
              }

              this.authService.addUser(this.newUser).subscribe(user => {
                console.log(user)
                this.router.navigate(['/home/listeusers']).then(() => {
                  window.location.reload()
                })
              })
            });
        },
        error: (err: any) => {
          console.error('Error uploading image:', err);
          if (err.error && err.error.error) {
            this.message = err.error.error;
          } else {
            this.message = 'Erreur lors du téléchargement de l\'image.';
          }
          this.err = 1;
        }
      });
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    this.err = 0;
    this.message = '';

    // Validate file size (max 5MB)
    const maxSizeMB = 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
      this.err = 2;
      this.uploadedImage = null!;
      event.target.value = '';
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      this.err = 3;
      this.uploadedImage = null!;
      event.target.value = '';
      return;
    }

    // Validate file name has extension
    if (!file.name || !file.name.includes('.')) {
      this.err = 4;
      this.uploadedImage = null!;
      event.target.value = '';
      return;
    }

    // All validations passed
    this.uploadedImage = file;
  }

}
