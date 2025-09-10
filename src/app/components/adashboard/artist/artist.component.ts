
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  artwork_id: string = '';
  artworks: any[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  user_id: string = '';
  user = signal<any | null>(null);

  imageURL = "http://localhost:5000/static/uploads/"

  totalOrders: number = 0;
  pendingOrders: number = 0;
  revenue: number = 0;
  recentOrders: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    // 
    this.user_id = localStorage.getItem('user_id') || '';
    // console.log(localStorage.getItem('user_id'))

    this.artist_id = localStorage.getItem('user_id') || '';
    this.fetchArtworksByArtist(this.artist_id);
    this.loadUser();
    console.log('🧑‍🎨 artistId:', this.artist_id);
    const token = localStorage.getItem('access_token'); // make sure this is stored at login
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>(`http://localhost:5000/api/orders/artist-orders/${this.artist_id}?limit=3`, { headers }).subscribe({
      next: (response) => {
        // backend returns { message, orders, count }
        this.recentOrders = response.orders || [];
      },
      error: (err) => {
        console.error('Error fetching recent orders:', err);
      }
    });
    this.http.get<any>(`http://localhost:5000/api/orders/artist-orders/${this.artist_id}`, { headers })
      .subscribe({
        next: (response) => {
          const allOrders = response.orders || [];

          this.totalOrders = allOrders.length;
          this.pendingOrders = allOrders.filter((o: any) => o.status === 'pending').length;
          this.revenue = allOrders.reduce((sum: number, o: any) => sum + (o.total_price || 0), 0);
        },
        error: (err) => {
          console.error('Error fetching stats:', err);
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

  deleteArtwork(artwork_id: string): void {
    if (!confirm('Are you sure you want to delete this artwork? This action cannot be undone.')) {
      return;
    }

    else {
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
    if (artwork && artwork.artwork_id) {
      this.router.navigate(['/artwork-details', artwork.artwork_id]);
    }
    else {
      console.error('Artwork ID is missing or undefined');
    }
  }
  loadUser(): void {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any>(`http://localhost:5000/api/users/${this.user_id}`, { headers }).subscribe({
      next: (response) => {
        console.log("User loaded:", response);
        this.user.set(response); // since you're using signals
      },
      error: (error) => {
        console.error('Failed to load user:', error);
      }
    });
  }

}
