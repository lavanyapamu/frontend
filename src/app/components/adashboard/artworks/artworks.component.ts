// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-artworks',
//   imports: [],
//   templateUrl: './artworks.component.html',
//   styleUrl: './artworks.component.css'
// })
// export class ArtworksComponent {

// }


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-artworks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './artworks.component.html',
  styleUrls: ['./artworks.component.css']
})
export class ArtworksComponent implements OnInit {

  artist_id: string = '';
  artwork_id:string='';
  artworks: any[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // 
    console.log(localStorage.getItem('user_id') )
    this.artist_id = localStorage.getItem('user_id') || '';
    this.fetchArtworksByArtist(this.artist_id);
    console.log('🧑‍🎨 artistId:', this.artist_id);
  }
  
  fetchArtworksByArtist(id: string): void {
    this.http.get<any[]>(`http://localhost:5000/api/artworks/artist/${id}`).subscribe({
      next: (response) => {
        this.artworks = response;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load artworks.';
        console.error(error);
        console.log(error)
        this.loading = false;
      }
    });
  }

  addartwork(): void {
    this.router.navigate(['/addartwork']);
  }

  
  editArtwork(artworkId: number): void {
    this.router.navigate(['/editartwork', artworkId]);
  } 
  
  deleteArtwork(artwork_id:string): void {
    if (!confirm('Are you sure you want to delete this artwork? This action cannot be undone.')) {
      return; 
    }

  else{
    const token = localStorage.getItem('access_token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
  
    this.http.delete<any>(`http://localhost:5000/api/artworks/${artwork_id}`, { headers }).subscribe({
      next: () => {
        alert('Artwork deleted successfully!');
        this.artworks = this.artworks.filter(a => a.artwork_id !== artwork_id);
        // this.router.navigate(['/artistdashboard']);
      },
      error: (err) => {
        this.errorMessage = 'Failed to delete artwork';
        console.error(err);
      }
    });
  }
}
  get artworksCount(): number {
    return this.artworks.length;
  }
}
