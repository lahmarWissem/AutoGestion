import { Modele } from './../models/modele.model';
import { VoitureService } from './../services/voiture.service';
import { Component, OnInit } from '@angular/core';
import { Voiture } from '../models/voiture.model';
import { ThisReceiver } from '@angular/compiler';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-list-voitures',
  templateUrl: './list-voitures.component.html',
  styleUrls: ['./list-voitures.component.css']
})
export class ListVoituresComponent implements OnInit {

  constructor(private voitureService: VoitureService, public authService: AuthService, private router: Router) { }
  image: any;
  listImages: String[] = [];
  voitures!: Voiture[];
  numberOfvoitures: number = 0;
  IdModele!: number;
  modeles!: Modele[];
  totalPages!: Array<number>;

  page = 0;
  size = 6;
  order = 'nomVoiture';
  asc = true;

  isFirst = false;
  isLast = false;

  ngOnInit(): void {

    this.chargerVoitures();

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


  chargerVoitures() {
    this.voitureService.listeVoiturepaginated(this.page, this.size, this.order, this.asc).subscribe({
      next: (data) => {
        this.voitures = data.content;
        this.numberOfvoitures = data.totalElements || 0;
        this.isFirst = data.first;
        this.isLast = data.last;
        this.totalPages = new Array(data['totalPages']);
        console.log(data);

        for (let index = 0; index < this.voitures.length; index++) {
          if (this.voitures[index].image && this.voitures[index].image.idImage) {
            this.voitureService
              .loadImage(this.voitures[index].image.idImage)
              .subscribe({
                next: (res: any) => {
                  this.listImages[index] =
                    'data:' + res.type + ';base64,' + res.image;
                },
                error: (err: any) => {
                  console.error('Error loading image:', err);
                  this.listImages[index] = 'assets/pngegg.png'; // Default car image
                }
              });
          } else {
            this.listImages[index] = 'assets/pngegg.png'; // Default car image
          }
        }
      },
      error: (err) => {
        console.error('Error loading voitures:', err);
        this.voitures = [];
        this.numberOfvoitures = 0;
      }
    });
  }



  supprimerVoiture(p: Voiture) {
    let conf = confirm('Etes-vous sûr ?');
    if (conf)
      this.voitureService.supprimerVoiture(p.idVoiture).subscribe(() => {
        console.log('produit supprimé');
        this.chargerVoitures();
      });
  }


  onChange() {
    if (!this.IdModele || isNaN(this.IdModele)) {
      this.chargerVoitures();
      return;
    }
    this.voitureService.rechercherParModele(this.IdModele).subscribe({
      next: (voits) => {
        this.voitures = voits;
        this.numberOfvoitures = voits.length;
        for (let index = 0; index < this.voitures.length; index++) {
          if (this.voitures[index].image && this.voitures[index].image.idImage) {
            this.voitureService
              .loadImage(this.voitures[index].image.idImage)
              .subscribe({
                next: (res: any) => {
                  this.listImages[index] =
                    'data:' + res.type + ';base64,' + res.image;
                },
                error: (err: any) => {
                  console.error('Error loading image:', err);
                  this.listImages[index] = 'assets/pngegg.png';
                }
              });
          } else {
            this.listImages[index] = 'assets/pngegg.png';
          }
        }
      },
      error: (err) => {
        console.error('Error searching by modele:', err);
      }
    });
  }
  sort(): void {
    this.asc = !this.asc;
    this.chargerVoitures();
  }

  rewind(): void {
    if (!this.isFirst) {
      this.page--;
      this.chargerVoitures();
    }
  }

  forward(): void {
    if (!this.isLast) {
      this.page++;
      this.chargerVoitures();
    }
  }

  setPage(page: number): void {
    this.page = page;
    this.chargerVoitures();
  }

  setOrder(order: string): void {
    this.order = order;
    this.chargerVoitures();
  }


}
