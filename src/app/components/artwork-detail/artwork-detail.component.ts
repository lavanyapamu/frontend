import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-artwork-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artwork-detail.component.html',
  styleUrls: ['./artwork-detail.component.css']
})
export class ArtworkDetailComponent implements OnInit {
  artwork: any = null;
  loading = true;
  error: string | null = null;
  imageLoaded = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadArtworkDetails();
  }

  private loadArtworkDetails(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchArtwork(id);
      } else {
        this.error = 'No artwork ID provided';
        this.loading = false;
      }
    });
  }

  private fetchArtwork(id: string): void {
    const token = localStorage.getItem('access_token');

    if (!token) {
      this.error = 'You must be logged in to view this artwork.';
      this.loading = false;
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.get<any>(`http://localhost:5000/api/artworks/${id}`, { headers })
      .subscribe({
        next: (response) => {
          this.artwork = response;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching artwork:', err);
          if (err.status === 401) {
            this.error = 'Unauthorized. Please log in again.';
          } else if (err.status === 404) {
            this.error = 'Artwork not found.';
          } else {
            this.error = 'Failed to load artwork details.';
          }
          this.loading = false;
        }
      });
  }

  getImageUrl(): string {
    if (!this.artwork || !this.artwork.image) {
      return '/assets/images/no-image.jpg';
    }
    if (this.artwork.image.startsWith('http')) {
      return this.artwork.image;
    }
    return `http://localhost:5000/static/uploads/${this.artwork.image}`;
  }

  onImageLoad(): void {
    this.imageLoaded = true;
  }

  onImageError(): void {
    this.imageLoaded = false;
  }

  getStatusBadge(): string {
    if (!this.artwork) return '';
    if (this.artwork.is_deleted) return 'deleted';
    if (this.artwork.quantity === 0) return 'sold-out';
    if (this.artwork.quantity <= 5) return 'low-stock';
    return 'available';
  }

  getStatusText(): string {
    if (!this.artwork) return '';
    if (this.artwork.is_deleted) return 'Deleted';
    if (this.artwork.quantity === 0) return 'Sold Out';
    if (this.artwork.quantity <= 5) return 'Low Stock';
    return 'Available';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  }

  goBack(): void {
    this.router.navigate(['artistd/artworks']);
  }

  editArtwork(artworkId?: string): void {
    if (!artworkId && this.artwork) {
      artworkId = this.artwork.artwork_id;
    }
    if (artworkId) {
      this.router.navigate(['/artistd/editartwork', artworkId]);
    }
  }

  deleteArtwork(artworkId: string): void {
    const token = localStorage.getItem('token');
    if (!token || !this.artwork) return;

    if (confirm('Are you sure you want to delete this artwork?')) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      this.http.delete(`http://localhost:5000/api/artworks/${artworkId}`, { headers })
        .subscribe({
          next: () => {
            alert('Artwork deleted successfully');
            this.goBack();
          },
          error: (err) => {
            console.error('Error deleting artwork:', err);
            alert('Failed to delete artwork');
          }
        });
    }
  }
}
