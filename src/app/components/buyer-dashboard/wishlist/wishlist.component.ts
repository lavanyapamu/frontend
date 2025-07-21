import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {
  wishlistItems: any[] = [];
  user_id: string = '';
  imageURL = 'http://localhost:5000/static/uploads/';

  constructor(private http: HttpClient, private router: Router) {
    this.user_id = localStorage.getItem('user_id') || '';
    this.loadWishlistItems();
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
removeFromWishlist(wishlistId: number): void {
  const token = localStorage.getItem('access_token');
  const headers = { Authorization: `Bearer ${token}` };
  this.http.delete(`http://localhost:5000/api/wishlist/${wishlistId}`, { headers }).subscribe({
    next: () => {
      alert('Item removed from wishlist successfully!');
      this.loadWishlistItems();
    },
    error: (error) => {
      console.error('Failed to remove from wishlist:', error);
      alert('Failed to remove item from wishlist');
    }
  });
}

moveToCart(wishlistItem: any): void {
  const token = localStorage.getItem('access_token');
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const cartData = {
    user_id: this.user_id,
    artwork_id: wishlistItem.artwork_id,
    quantity: 1,
    price: wishlistItem.price
  };

  this.http.post<any>(`http://localhost:5000/api/cart/`, cartData, { headers }).subscribe({
    next: () => {
      this.removeFromWishlist(wishlistItem.wishlist_id);
      alert('Moved to cart!');
    },
    error: (error) => {
      console.error('Failed to add to cart:', error);
      alert('Failed to add item to cart');
    }
  });
}
goToArtworks() {
  this.router.navigate(['/buyerdashboard/artworks']);
}
}
