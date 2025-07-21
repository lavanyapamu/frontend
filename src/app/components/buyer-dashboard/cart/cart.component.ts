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

  constructor(private http: HttpClient, private router: Router) {
    this.user_id = localStorage.getItem('user_id') || '';
    this.loadCartItems();
  }

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
}
