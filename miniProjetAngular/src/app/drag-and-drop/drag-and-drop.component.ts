import { Voiture } from './../models/voiture.model';
import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { Modele } from '../models/modele.model';

import { AuthService } from '../services/auth.service';
import { VoitureService } from '../services/voiture.service';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.css']
})
export class DragAndDropComponent implements OnInit {

  voituresforselling: Voiture[] = [];
  voituressold: Voiture[] = [];
  numberOfvoitures: number = 0;

  constructor(
    private voitureService: VoitureService,
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.chargerVoituresSelling();
    this.chargerVoituresSold();
  }

  drop(event: CdkDragDrop<Voiture[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      // Update positions for all items in the reordered list
      event.container.data.forEach((v, i) => {
        v.position = i;
        this.voitureService.updateVoiture(v).subscribe({
          next: (car) => console.log('Updated:', car.nomVoiture),
          error: (err) => console.error('Error updating position:', err)
        });
      });
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const voiture = event.container.data[event.currentIndex];

      // Update the type based on which list it was dropped into
      if (event.container.data === this.voituresforselling) {
        voiture.type = 'selling';
      } else {
        voiture.type = 'sold';
      }

      // Update positions for both lists
      this.voituresforselling.forEach((v, i) => {
        v.position = i;
        this.voitureService.updateVoiture(v).subscribe({
          next: (updatedVoiture) => console.log('Updated selling:', updatedVoiture.nomVoiture),
          error: (err) => console.error('Error updating selling voiture:', err)
        });
      });

      this.voituressold.forEach((v, i) => {
        v.position = i + this.voituresforselling.length;
        this.voitureService.updateVoiture(v).subscribe({
          next: (updatedVoiture) => console.log('Updated sold:', updatedVoiture.nomVoiture),
          error: (err) => console.error('Error updating sold voiture:', err)
        });
      });
    }
  }

  chargerVoituresSelling() {
    this.voitureService.findbyType('selling').subscribe({
      next: (voits) => {
        this.voituresforselling = voits || [];
        console.log('Loaded selling voitures:', this.voituresforselling);
      },
      error: (err) => {
        console.error('Error loading selling voitures:', err);
        this.voituresforselling = [];
      }
    });
  }

  chargerVoituresSold() {
    this.voitureService.findbyType('sold').subscribe({
      next: (voits) => {
        this.voituressold = voits || [];
        console.log('Loaded sold voitures:', this.voituressold);
      },
      error: (err) => {
        console.error('Error loading sold voitures:', err);
        this.voituressold = [];
      }
    });
  }

  supprimerVoiture(p: Voiture) {
    let conf = confirm('Etes-vous sûr ?');
    if (conf) {
      this.voitureService.supprimerVoiture(p.idVoiture).subscribe({
        next: () => {
          console.log('Voiture supprimée');
          this.chargerVoituresSelling();
          this.chargerVoituresSold();
        },
        error: (err) => {
          console.error('Error deleting voiture:', err);
        }
      });
    }
  }
}
