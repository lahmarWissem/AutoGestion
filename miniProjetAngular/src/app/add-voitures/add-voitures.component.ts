import { VoitureService } from './../services/voiture.service';
import { Voiture } from './../models/voiture.model';
import { Modele } from './../models/modele.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Image } from '../models/image.model';

@Component({
  selector: 'app-add-voitures',
  templateUrl: './add-voitures.component.html',
  styleUrls: ['./add-voitures.component.css']
})
export class AddVoituresComponent implements OnInit {
  modeles!: Modele[];
  newVoiture = new Voiture();
  newIdMod!: number;
  newModele!: Modele;
  message: string = '';
  err: number = 0;

  uploadedImage!: File;
  image: any;
  response: any;
  constructor(private voitureService: VoitureService, private router: Router) { }

  ngOnInit(): void {
    this.voitureService.listeModeles().subscribe({
      next: (mods) => {
        this.modeles = mods;
        console.log('Modeles loaded:', mods);
      },
      error: (err) => {
        console.error('Error loading modeles:', err);
        this.modeles = [];
      }
    });
  }
  addVoiture() {
    if (!this.uploadedImage) {
      this.err = 5;
      return;
    }

    this.voitureService
      .uploadImage(this.uploadedImage, this.uploadedImage.name)
      .subscribe({
        next: (response: any) => {
          this.voitureService
            .loadImage(response.idImage)
            .subscribe((image: any) => {
              let img = new Image();
              img.idImage = image.idImage;
              img.name = image.name;
              img.type = image.type;
              img.image = image.image;
              this.newVoiture.image = new Image();
              this.newVoiture.image = img;

              this.newVoiture.modele = this.modeles.find(
                (mod) => mod.idMod == this.newIdMod
              )!;
              this.voitureService
                .ajouterVoiture(this.newVoiture)
                .subscribe((voit) => {
                  console.log(voit);
                  this.router.navigate(['/home/listVoiture']);
                });
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
