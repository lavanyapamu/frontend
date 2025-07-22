import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-artwork-details',
  imports: [CommonModule],
  templateUrl: './artwork-details.component.html',
  styleUrls: ['./artwork-details.component.css']
})
export class ArtworkDetailsComponent {
  artworkId: string | null = null;
  artwork: any = null;
  isLoading = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}
  imageURL = "http://localhost:5000/static/uploads/"

  ngOnInit(): void {
    this.artworkId = this.route.snapshot.paramMap.get('artwork_id');
    if (this.artworkId) {
      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      this.http.get<any>(`http://localhost:5000/api/artworks/${this.artworkId}`, { headers })
        .subscribe({
          next: (data) => {
            this.artwork = data;
            this.isLoading = false;
          },
          error: (err) => {
            this.error = 'Artwork not found or failed to load.';
            this.isLoading = false;
          }
        });
    }
  }
}
