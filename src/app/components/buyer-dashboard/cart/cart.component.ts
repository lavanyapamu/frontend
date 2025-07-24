import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartItems: any[] = [];
  user_id: string = '';
  imageURL = 'http://localhost:5000/static/uploads/';
  private updatingItems: Set<number> = new Set(); // Track items being updated

  constructor(private http: HttpClient, private router: Router) {
    this.user_id = localStorage.getItem('user_id') || '';
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.http.get<any>(`http://localhost:5000/api/cart/user/${this.user_id}`).subscribe({
      next: (response) => {
        // Sort items by cart_id to maintain consistent order
        this.cartItems = response.data.sort((a: any, b: any) => a.cart_id - b.cart_id);
      },
      error: (error) => {
        console.error('Failed to load cart items:', error);
      }
    });
  }

  removeFromCart(cartId: number): void {
    const token = localStorage.getItem('access_token');
    const headers = { Authorization: `Bearer ${token}` };

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

  clearCart(): void {
    if (!confirm('Are you sure you want to clear your entire cart?')) return;
    
    const token = localStorage.getItem('access_token');
    const headers = { Authorization: `Bearer ${token}` };

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

  goToArtworks() {
    this.router.navigate(['/buyerdashboard/artworks']);
  }

  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  goToCheckout(): void {
    this.router.navigate(['/buyerdashboard/checkout']);
  }

  increaseQuantity(item: any): void {
    if (this.updatingItems.has(item.cart_id)) return; // Prevent multiple requests
    
    this.updatingItems.add(item.cart_id);
    
    const token = localStorage.getItem('access_token');
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const updatedItem = {
      quantity: item.quantity + 1
    };

    this.http.put(`http://localhost:5000/api/cart/${item.cart_id}`, updatedItem, { headers }).subscribe({
      next: (response) => {
        // Update the item in place instead of reloading entire cart
        const itemIndex = this.cartItems.findIndex(cartItem => cartItem.cart_id === item.cart_id);
        if (itemIndex !== -1) {
          this.cartItems[itemIndex].quantity = item.quantity + 1;
        }
        this.updatingItems.delete(item.cart_id);
      },
      error: (error) => {
        console.error('Failed to increase quantity:', error);
        alert('Failed to update cart');
        this.updatingItems.delete(item.cart_id);
      }
    });
  }

  decreaseQuantity(item: any): void {
    if (this.updatingItems.has(item.cart_id)) return; // Prevent multiple requests
    
    if (item.quantity <= 1) {
      this.removeFromCart(item.cart_id);
      return;
    }

    this.updatingItems.add(item.cart_id);

    const token = localStorage.getItem('access_token');
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const updatedItem = {
      quantity: item.quantity - 1
    };

    this.http.put(`http://localhost:5000/api/cart/${item.cart_id}`, updatedItem, { headers }).subscribe({
      next: (response) => {
        // Update the item in place instead of reloading entire cart
        const itemIndex = this.cartItems.findIndex(cartItem => cartItem.cart_id === item.cart_id);
        if (itemIndex !== -1) {
          this.cartItems[itemIndex].quantity = item.quantity - 1;
        }
        this.updatingItems.delete(item.cart_id);
      },
      error: (error) => {
        console.error('Failed to decrease quantity:', error);
        alert('Failed to update cart');
        this.updatingItems.delete(item.cart_id);
      }
    });
  }

  // Helper method to check if item is being updated
  isItemUpdating(cartId: number): boolean {
    return this.updatingItems.has(cartId);
  }

  // TrackBy function to maintain item positions
  trackByCartId(index: number, item: any): number {
    return item.cart_id;
  }
}