import { VoitureService } from './../services/voiture.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  totalVoitures: number = 0;
  totalModels: number = 0;
  totalUsers: number = 0;
  totalSelling: number = 0;
  totalSold: number = 0;
  isLoading: boolean = true;

  constructor(
    private voitureService: VoitureService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;

    this.voitureService.listeVoiture().subscribe({
      next: (voitures) => {
        this.totalVoitures = voitures ? voitures.length : 0;
        this.totalSelling = voitures ? voitures.filter(v => v.type === 'selling').length : 0;
        this.totalSold = voitures ? voitures.filter(v => v.type === 'sold').length : 0;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading voitures:', err);
        this.totalVoitures = 0;
        this.totalSelling = 0;
        this.totalSold = 0;
        this.isLoading = false;
      }
    });

    this.voitureService.listeModeless().subscribe({
      next: (modeles) => {
        this.totalModels = modeles ? modeles.length : 0;
      },
      error: (err) => {
        console.error('Error loading modeles:', err);
        this.totalModels = 0;
      }
    });

    this.authService.listeUsers().subscribe({
      next: (users) => {
        this.totalUsers = users ? users.length : 0;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.totalUsers = 0;
      }
    });
  }
}
