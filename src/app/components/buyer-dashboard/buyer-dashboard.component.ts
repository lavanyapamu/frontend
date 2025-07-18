
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-buyer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buyer-dashboard.component.html',
  styleUrls: ['./buyer-dashboard.component.css']
})
export class BuyerDashboardComponent implements OnInit {
  
  user_id: string = '';
  artworks: any[] = [];
  cartItems: any[] = [];
  wishlistItems: any[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  currentView: string = 'artworks'; 

  imageURL = "http://localhost:5000/static/uploads/"

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.user_id = localStorage.getItem('user_id') || '';
    this.loadAllArtworks();
    this.loadCartItems();
    this.loadWishlistItems();
  }

  // Navigation methods
  setActiveView(view: string): void {
    this.currentView = view;
  }

  // Load all artworks for browsing
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

  // Load cart items
  loadCartItems(): void {
    this.http.get<any>(`http://localhost:5000/api/cart/user/${this.user_id}`).subscribe({
      next: (response) => {
        this.cartItems = response.data;
      },
      error: (error) => {
        console.error('Failed to load cart items:', error);
      }
    });
  }

  // Load wishlist items
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

  // Add to cart
  addToCart(artwork: any): void {
    const token = localStorage.getItem('access_token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const cartData = {
      user_id: this.user_id,
      artwork_id: artwork.artwork_id,
      quantity: 1,
      price: artwork.price
    };

    this.http.post<any>(`http://localhost:5000/api/cart/`, cartData, { headers }).subscribe({
      next: (response) => {
        alert('Item added to cart successfully!');
        this.loadCartItems();
      },
      error: (error) => {
        console.error('Failed to add to cart:', error);
        alert('Failed to add item to cart');
      }
    });
  }

  // Add to wishlist
  addToWishlist(artwork: any): void {
    const token = localStorage.getItem('access_token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const wishlistData = {
      user_id: this.user_id,
      artwork_id: artwork.artwork_id,
      price: artwork.price
    };

    this.http.post<any>(`http://localhost:5000/api/wishlist/`, wishlistData, { headers }).subscribe({
      next: (response) => {
        alert('Item added to wishlist successfully!');
        this.loadWishlistItems();
      },
      error: (error) => {
        console.error('Failed to add to wishlist:', error);
        alert('Failed to add item to wishlist');
      }
    });
  }

  // Remove from cart
  removeFromCart(cartId: number): void {
    const token = localStorage.getItem('access_token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    this.http.delete(`http://localhost:5000/api/cart/${cartId}`, { headers }).subscribe({
      next: () => {
        alert('Item removed from cart successfully!');
        this.loadCartItems();
      },
      error: (error) => {
        console.error('Failed to remove from cart:', error);
        alert('Failed to remove item from cart');
      }
    });
  }

  // Remove from wishlist
  removeFromWishlist(wishlistId: number): void {
    const token = localStorage.getItem('access_token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };

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

  // Move from wishlist to cart
  moveToCart(wishlistItem: any): void {
    this.addToCart(wishlistItem);
    this.removeFromWishlist(wishlistItem.wishlist_id);
  }

  // Clear entire cart
  clearCart(): void {
    if (!confirm('Are you sure you want to clear your entire cart?')) {
      return;
    }

    const token = localStorage.getItem('access_token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    this.http.delete(`http://localhost:5000/api/cart/user/${this.user_id}`, { headers }).subscribe({
      next: () => {
        alert('Cart cleared successfully!');
        this.loadCartItems();
      },
      error: (error) => {
        console.error('Failed to clear cart:', error);
        alert('Failed to clear cart');
      }
    });
  }

  // Calculate cart total
  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Check if item is in cart
  isInCart(artworkId: string): boolean {
    return this.cartItems.some(item => item.artwork_id === artworkId);
  }

  // Check if item is in wishlist
  isInWishlist(artworkId: string): boolean {
    return this.wishlistItems.some(item => item.artwork_id === artworkId);
  }

  // Logout
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    this.router.navigate(['/login']);
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}