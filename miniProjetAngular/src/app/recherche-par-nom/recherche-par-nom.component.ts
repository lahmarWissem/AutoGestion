import { VoitureService } from './../services/voiture.service';
import { Component, OnInit } from '@angular/core';
import { Voiture } from '../models/voiture.model';

@Component({
  selector: 'app-recherche-par-nom',
  templateUrl: './recherche-par-nom.component.html',
  styleUrls: ['./recherche-par-nom.component.css']
})
export class RechercheParNomComponent implements OnInit {
  nomVoiture!: string;
  voitures!: Voiture[];
  allVoitures!: Voiture[];
  searchTerm!: string;
  numberOfvoitures: number = 0;

  constructor(private voitureService: VoitureService) { }

  ngOnInit(): void {
    this.voitureService.listeVoiture().subscribe((voits) => {
      console.log(voits);
      this.voitures = voits;
      this.allVoitures = voits; // Store all for frontend filtering
      this.numberOfvoitures = voits.length;
      this.loadImagesForVoitures();
    });
  }

  loadImagesForVoitures() {
    for (let index = 0; index < this.voitures.length; index++) {
      if (this.voitures[index].image && this.voitures[index].image.idImage) {
        this.voitureService
          .loadImage(this.voitures[index].image.idImage)
          .subscribe({
            next: (res: any) => {
              (this.voitures[index] as any).imageStr = 'data:' + res.type + ';base64,' + res.image;
            },
            error: (err: any) => {
              (this.voitures[index] as any).imageStr = 'assets/pngegg.png';
            }
          });
      } else {
        (this.voitures[index] as any).imageStr = 'assets/pngegg.png';
      }
    }
  }

  rechercherProds() {
    this.voitureService.rechercherParNom(this.nomVoiture).subscribe(voits => {
      this.voitures = voits;
      this.numberOfvoitures = voits.length;
      this.loadImagesForVoitures();
    });
  }

  onKeyUp(filterText: string) {
    this.voitures = this.allVoitures.filter(item =>
      item.nomVoiture.toLowerCase().includes(filterText.toLowerCase()));

    // Maintain correct count
    this.numberOfvoitures = this.voitures.length;
  }
}
