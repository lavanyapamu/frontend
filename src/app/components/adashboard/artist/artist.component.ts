
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Order {
  orderId: string;
  artwork: string;
  customer: string;
  quantity: number;
  status: string;
}
@Component({
  selector: 'app-artist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {

  artist_id: string = '';
  artwork_id:string='';
  artworks: any[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  imageURL = "http://localhost:5000/static/uploads/"

  recentOrders: any[] = [];
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

    
     this.http.get<Order[]>('http://localhost:5000/api/orders/all?limit=2').subscribe({
      next: (data) => {
        this.recentOrders = data;
      },
      error: (err) => {
        console.error('Error fetching recent orders:', err);
      }
    });
  }
  
  fetchArtworksByArtist(id: string): void {
    const token = localStorage.getItem('access_token');
    this.http.get<any[]>(`http://localhost:5000/api/artworks/artist/${id}`, 
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).subscribe({
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
  
  editArtwork(artworkId: number): void {
    this.router.navigate(['/artistd/editartwork', artworkId]);
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
  // get earnings():number{
  //   return this.artworks.earnings;
  // }
  viewArtwork(artwork: any) {
    console.log('Navigating to artwork:', artwork); // add this line
    if (artwork&&artwork.artwork_id)
      {
         this.router.navigate(['/artwork-details', artwork.artwork_id]);
      } 
    else {
      console.error('Artwork ID is missing or undefined');
    }
  }
  
}
