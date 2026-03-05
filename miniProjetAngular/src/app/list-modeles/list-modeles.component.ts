import { VoitureService } from './../services/voiture.service';
import { Modele } from './../models/modele.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-modeles',
  templateUrl: './list-modeles.component.html',
  styleUrls: ['./list-modeles.component.css']
})
export class ListModelesComponent implements OnInit {
  modeles! :Modele[];
  ajout:boolean=true;

  updatedMod : Modele = {"idMod":0,"nomMod":""};
  
  constructor(private voitureService: VoitureService) { }

  ngOnInit(): void {
this.chargerModeles();
}

modeleUpdated(mod:Modele){
  console.log("modele Rece Du composant Update Modele",mod)
  this.voitureService.ajouterModele(mod).subscribe( ()=> {
    this.chargerModeles();
    this.resetForm();
  });
}

resetForm(){
  this.updatedMod = {"idMod":0,"nomMod":""};
  this.ajout = true;
}
chargerModeles(){
  this.voitureService.listeModeless().
  subscribe({
    next: (mods) => {
      this.modeles = mods || [];
      console.log('Loaded modeles:', this.modeles);
    },
    error: (err) => {
      console.error('Error loading modeles:', err);
      this.modeles = [];
    }
  });
}
  

  supprimerModele(mod:Modele){
    let conf = confirm('Etes-vous sûr ?');
    if (conf)
      this.voitureService.supprimerModele(mod.idMod).subscribe(() => {
        console.log('Modele supprimé');
        this.chargerModeles();
      });
  }
  updateMod(mod:Modele) {
    this.updatedMod=mod;
    this.ajout=false;
    }
}
