import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface OrderItem {
  order_item_id: string;
  artwork_id: string;
  quantity: number;
  price: number;
  status: string;  
  artwork?: {
    title: string;
    description: string;
    image: string;
    category_name?: {
      name: string;
    };

    style?: {
      name: string;
    };
  };
  selectedToCancel?: boolean;  // ✅ For cancel checkbox
  tempRating?: number;         // ✅ For review form
  tempReview?: string;
}

export interface Order {
  order_id: string;
  user_id: string;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  order_items?: OrderItem[];
  payment?: {
    payment_id: string;
    upi_id: string;
    full_name: string;
    email: string;
    phone_number: string;
    city: string;
    state: string;
    country: string;
    pincode: number;
    payment_method: string;
    shipping_fee: number;
    subtotal: number;
    total: number;
    status: string;
    payment_date: string;
  };
}


@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class buyerOrdersComponent  implements OnInit {
  orders: Order[] = [];
  printDate: string = '';
  isLoading = true;
  error: string | null = null;
  user_id: string = '';
  selectedOrder: Order | null = null;
  showOrderDetails = false;
  itemsPerPage = 10;
  availableItemsPerPage = [5, 10, 15, 20];
  showCancelModal = false;
  showReviewModal = false;
  constructor(
    public http: HttpClient,
    public router: Router
  ) {}

  ngOnInit(): void {
    
    this.user_id = this.getCurrentUserId();
    if (this.user_id) {
      this.loadOrders();
    } else {
      this.router.navigate(['/login']);
    }
    this.printDate = this.formatDate(new Date().toISOString());
  }

  getCurrentUserId(): string {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.user_id || '';
      } catch (e) {
        console.error('Error parsing currentUser from localStorage:', e);
      }
    }
    return localStorage.getItem('user_id') || '';
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token') || 
                  localStorage.getItem('token') || 
                  localStorage.getItem('authToken');
    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  loadOrders(): void {
    this.isLoading = true;
    this.error = null;

    const headers = this.getAuthHeaders();

    this.http.get<any>(`http://localhost:5000/api/orders/user/${this.user_id}`, { headers })
      .subscribe({
        next: (response) => {
          console.log('Orders response:', response);
          
          // Handle different response formats
          if (Array.isArray(response)) {
            this.orders = response;
          } else if (response && Array.isArray(response.data)) {
            this.orders = response.data;
          } else if (response && response.orders) {
            this.orders = response.orders;
          } else {
            this.orders = [];
          }

          this.isLoading = false;
          console.log('Loaded orders:', this.orders);
        },
        error: (err) => {
          console.error('Failed to load orders:', err);
          this.error = 'Failed to load orders. Please try again.';
          this.isLoading = false;
          this.orders = [];
        }
      });
  }

  viewOrderDetails(orderId: string): void {
    this.isLoading = true;
    const headers = this.getAuthHeaders();

    this.http.get<any>(`http://localhost:5000/api/orders/${orderId}?user_id=${this.user_id}`, { headers })
      .subscribe({
        next: (response) => {
          console.log('Order details response:', response);
          this.selectedOrder = {
            ...response,
            order_items: response.order_items || response.items || [],  // 👈 Add this line right here
          };
          this.showOrderDetails = true;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load order details:', err);
          this.error = 'Failed to load order details. Please try again.';
          this.isLoading = false;
        }
      });
  }

  closeOrderDetails(): void {
    this.showOrderDetails = false;
    this.selectedOrder = null;
  }
  // ✅ Cancel logic
  openCancelModal(order: Order) {
    this.selectedOrder = order;
    this.showCancelModal = true;
  }
  closeCancelModal() { this.showCancelModal = false; }
  submitCancel() {
    const itemsToCancel = this.selectedOrder?.order_items?.filter(i => i.selectedToCancel);
    console.log('Cancelling items:', itemsToCancel);
    // Call API here: POST /api/orders/cancel
    this.closeCancelModal();
  }
  // ✅ Review logic
openReviewModal(order: Order) {
  const items = order.order_items || order.items || [];
  const normalized = (items || []).map(i => ({
    ...i,
    tempRating: i.tempRating ?? 5,   // default 5 stars
    tempReview: i.tempReview ?? ''
  }));

  this.selectedOrder = { ...order, order_items: normalized };
  this.showReviewModal = true;
}


  closeReviewModal() { this.showReviewModal = false; 
      setTimeout(() => this.selectedOrder = null, 200);
  }
  submitReview(item: OrderItem) {
    const payload = {
      user_id: this.user_id,
      artwork_id: item.artwork_id,
      rating: item.tempRating || 5,
      review_text: item.tempReview || 'No review'
    };
    const headers = this.getAuthHeaders();
    this.http.post(`http://localhost:5000/api/reviews`, payload, { headers })
      .subscribe({
        next: () => { alert('Review submitted!'); },
        error: () => { alert('Failed to submit review'); }
      });
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'confirmed':
        return 'status-confirmed';
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  }

  getStatusLabel(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status || 'Unknown';
    }
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  }

  formatCurrency(amount: number): string {
    return `INR ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) {
      // serve from Flask
      return 'http://localhost:5000/static/uploads/artwork.jpg';
    }
  
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
  
    return `http://localhost:5000/static/uploads/${imagePath}`;
  }
  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    if (!imgElement.src.includes('placeholder-artwork.jpg')) {
      imgElement.src = 'http://localhost:5000/static/uploads/placeholder-artwork.jpg';
    }
  }
  

  onItemsPerPageChange(): void {
    // If you want to implement pagination, you can add logic here
    console.log('Items per page changed to:', this.itemsPerPage);
  }

  printOrder(): void {
    if (this.selectedOrder) {
      window.print();
    }
  }

  trackOrder(orderId: string): void {
    // Navigate to order tracking page or implement tracking logic
    console.log('Track order:', orderId);
    // You can implement order tracking functionality here
  }

  reorder(orderId: string): void {
    // Navigate to cart and add all items from this order
    console.log('Reorder:', orderId);
    // You can implement reorder functionality here
  }

  getTotalItems(): number {
    return this.orders.length;
  }

  getOrderNumber(orderId: string): string {
    // Extract a readable order number from UUID
    const orderNum = orderId.replace(/-/g, '').substring(0, 10).toUpperCase();
    return `ORD${orderNum}`;
  }
}