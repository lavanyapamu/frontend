import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-artworks-buyer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './artworks.component.html',
  styleUrls: ['./artworks.component.css']
})
export class BuyerArtworksComponent {
  artworks: any[] = [];
  cartItems: any[] = [];
  wishlistItems: any[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  imageURL = 'http://localhost:5000/static/uploads/';
  user_id: string = '';

  constructor(private http: HttpClient) {
    this.user_id = localStorage.getItem('user_id') || '';
    this.loadAllArtworks();
    this.loadCartItems();
    this.loadWishlistItems();
  }

  loadAllArtworks(): void {
    this.loading = true;
    this.http.get<any[]>(`http://localhost:5000/api/artworks`).subscribe({
      next: (response) => {
        this.artworks = response;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load artworks.';
        console.error(error);
        this.loading = false;
      }
    });
  }

  loadCartItems(): void {
    this.http.get<any>(`http://localhost:5000/api/cart/user/${this.user_id}`).subscribe({
      next: (response) => {
        this.cartItems = response.data || [];
      },
      error: (error) => {
        console.error('Failed to load cart items:', error);
      }
    });
  }

  loadWishlistItems(): void {
    this.http.get<any[]>(`http://localhost:5000/api/wishlist/user/${this.user_id}`).subscribe({
      next: (response) => {
        this.wishlistItems = response;
      },
      error: (error) => {
        console.error('Failed to load wishlist items:', error);
      }
    });
  }

  isInCart(artworkId: string): boolean {
    return this.cartItems.some(item => item.artwork_id === artworkId);
  }

  isInWishlist(artworkId: string): boolean {
    return this.wishlistItems.some(item => item.artwork_id === artworkId);
  }

  addToCart(artwork: any): void {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      user_id: this.user_id,
      artwork_id: artwork.artwork_id,
      quantity: 1,
      price: artwork.price
    };

    this.http.post(`http://localhost:5000/api/cart/`, body, { headers }).subscribe({
      next: () => {
        alert('Added to cart!');
        this.loadCartItems();
      },
      error: (err) => {
        console.error('Add to cart failed', err);
        alert('Failed to add to cart');
      }
    });
  }

  addToWishlist(artwork: any): void {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      user_id: this.user_id,
      artwork_id: artwork.artwork_id,
      price: artwork.price
    };

    this.http.post(`http://localhost:5000/api/wishlist/`, body, { headers }).subscribe({
      next: () => {
        alert('Added to wishlist!');
        this.loadWishlistItems();
      },
      error: (err) => {
        console.error('Add to wishlist failed', err);
        alert('Failed to add to wishlist');
      }
    });
  }
}
