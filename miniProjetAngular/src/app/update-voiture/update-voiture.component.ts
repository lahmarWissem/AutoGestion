import { AuthService } from './../services/auth.service';
import { Voiture } from './../models/voiture.model';
import { Modele } from './../models/modele.model';
import { Image } from './../models/image.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VoitureService } from '../services/voiture.service';

@Component({
  selector: 'app-update-voiture',
  templateUrl: './update-voiture.component.html',
  styleUrls: ['./update-voiture.component.css']
})
export class UpdateVoitureComponent implements OnInit {
  modeles!: Modele[];
  updatedModId!: number;
  currentVoiture = new Voiture();
  x?: string;
  image: any;
  ImageVoiture: any;
  response: any;

  err: number = 0;
  uploadedImage!: File;
  message: string = '';

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private voitureService: VoitureService, private authService: AuthService) { }

  ngOnInit(): void {
    this.voitureService.listeModeles().
      subscribe(mods => {
        this.modeles = mods;
        console.log(mods);
      });
    this.voitureService.consulterVoiture(this.activatedRoute.snapshot.params['id']).
      subscribe(voit => {
        this.currentVoiture = voit;
        if (this.currentVoiture.modele) {
          this.updatedModId = this.currentVoiture.modele.idMod;
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

    // Optional: Validate file name has extension
    if (!file.name || !file.name.includes('.')) {
      this.err = 4;
      this.uploadedImage = null!;
      event.target.value = '';
      return;
    }

    // All validations passed
    this.uploadedImage = file;
  }

  updateVoiture() {
    this.currentVoiture.modele = this.modeles.find(mod => mod.idMod == this.updatedModId)!;

    // If a new image was uploaded
    if (this.uploadedImage) {
      this.voitureService
        .uploadImage(this.uploadedImage, this.uploadedImage.name)
        .subscribe({
          next: (response: any) => {
            this.voitureService
              .loadImage(response.idImage)
              .subscribe((imageObj: any) => {
                let img = new Image();
                img.idImage = imageObj.idImage;
                img.name = imageObj.name;
                img.type = imageObj.type;
                img.image = imageObj.image;

                this.currentVoiture.image = img;

                // Update voiture with new image
                this.voitureService.updateVoiture(this.currentVoiture).subscribe(voit => {
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
    } else {
      // Update without changing the image
      this.voitureService.updateVoiture(this.currentVoiture).subscribe(voit => {
        this.router.navigate(['/home/listVoiture']);
      });
    }
  }

}
