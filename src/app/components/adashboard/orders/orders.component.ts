import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var $: any; // For Bootstrap modal

interface OrderItem {
  order_item_id: string;
  order_id: string;
  artwork_id: string;
  quantity: number;
  price: number;
  artwork?: {
    artwork_id: string;
    title: string;
    description?: string;
    price: number;
    image_url?: string;
  };
}

interface Order {
  order_id: string;
  user_id: string;
  user_name:string;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  payment?: any;
}

interface User {
  user_id: string;
  username: string;
  email: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
}

@Component({
  selector: 'app-orders',
  imports:[CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, OnDestroy {
  // Data properties
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  paginatedOrders: Order[] = [];
  selectedOrder: Order | null = null;
  users: { [key: string]: User } = {};
  
  // Loading state
  isLoading: boolean = false;
  
  // Filter and search properties
  searchTerm: string = '';
  selectedStatusFilter: string = '';
  
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  
  // Subscription for auto-refresh
  private refreshSubscription: Subscription | null = null;
  
  // API base URL - adjust according to your backend
  private readonly apiUrl = 'http://localhost:5000/api'; // Adjust this URL to match your Flask backend
  
  constructor(private http: HttpClient) {}
  
  ngOnInit(): void {
    this.loadOrders();
    this.startAutoRefresh();
  }
  
  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
  
  /**
   * Load all orders from backend
   */
  loadOrders(): void {
    this.isLoading = true;
    
    // Fetch all orders using the new endpoint
    this.http.get<any>(`${this.apiUrl}/orders/all`).subscribe({
      next: (response) => {
        // Handle the response - it should be an array of orders
        if (Array.isArray(response)) {
          this.orders = response;
        } else {
          console.error('Unexpected response format:', response);
          this.orders = [];
        }
        
        // Load user details for orders
        this.loadUserDetails();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading orders:', error);
        this.isLoading = false;
        alert('Failed to load orders. Please check your backend connection.');
        this.orders = [];
        this.filterOrders();
      }
    });
  }
  
  /**
   * Load user details for orders (simplified since orders already contain items)
   */
  private loadUserDetails(): void {
    const userPromises: Promise<void>[] = [];
    
    // Get unique user IDs
    const uniqueUserIds = [...new Set(this.orders.map(order => order.user_id))];
    
    uniqueUserIds.forEach(userId => {
      if (!this.users[userId]) {
        const userPromise = new Promise<void>((resolve) => {
          // Since you might not have a users endpoint, create a mock user
          // You can replace this with actual API call if you have users endpoint
          this.users[userId] = {
            user_id: userId,
            username: `Customer ${userId.substring(0, 8)}`,
            email: `customer${userId.substring(0, 8)}@example.com`
          };
          resolve();
        });
        
        userPromises.push(userPromise);
      }
    });
    
    // Wait for all user details to load
    Promise.all(userPromises).then(() => {
      this.isLoading = false;
      this.filterOrders();
    });
  }
  
  /**
   * Start auto-refresh for new orders (every 30 seconds)
   */
  private startAutoRefresh(): void {
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.loadOrders();
    });
  }
  
  /**
   * Filter orders based on search term and status
   */
  filterOrders(): void {
    let filtered = [...this.orders];
    
    // Apply status filter
    if (this.selectedStatusFilter) {
      filtered = filtered.filter(order => order.status === this.selectedStatusFilter);
    }
    
    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(order => 
        order.order_id.toLowerCase().includes(searchLower) ||
        this.getUserName(order.user_id).toLowerCase().includes(searchLower) ||
        order.items.some(item => 
          item.artwork?.title?.toLowerCase().includes(searchLower) ||
          item.artwork_id.toLowerCase().includes(searchLower)
        )
      );
    }
    
    this.filteredOrders = filtered;
    this.updatePagination();
  }
  
  /**
   * Update pagination based on filtered orders
   */
  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }
    this.updatePaginatedOrders();
  }
  
  /**
   * Update paginated orders for current page
   */
  private updatePaginatedOrders(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);
  }
  
  /**
   * Navigate to specific page
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedOrders();
    }
  }
  
  /**
   * Get page numbers for pagination
   */
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    const halfPages = Math.floor(maxPagesToShow / 2);
    
    let startPage = Math.max(1, this.currentPage - halfPages);
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
  
  /**
   * Get start index for pagination info
   */
  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }
  
  /**
   * Get end index for pagination info
   */
  getEndIndex(): number {
    return Math.min(this.getStartIndex() + this.itemsPerPage, this.filteredOrders.length);
  }
  
  /**
   * Update order status
   */
  updateOrderStatus(orderId: string, event: any): void {
    const newStatus = event.target.value;
    const originalOrder = this.orders.find(o => o.order_id === orderId);
    const originalStatus = originalOrder?.status;
    
    this.http.put(`${this.apiUrl}/orders/${orderId}/status`, { status: newStatus }).subscribe({
      next: (response) => {
        // Update local order status
        const order = this.orders.find(o => o.order_id === orderId);
        if (order) {
          order.status = newStatus;
          order.updated_at = new Date().toISOString();
        }
        this.filterOrders();
        console.log('Order status updated successfully');
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error updating order status:', error);
        // Revert the dropdown to previous value
        event.target.value = originalStatus || 'pending';
        alert('Failed to update order status. Please try again.');
      }
    });
  }
  
  /**
   * View order details
   */

viewOrderDetails(order: Order): void {
  this.selectedOrder = order;
  $('#orderDetailsModal').modal('show');
}
  
  /**
   * Get order count by status
   */
  getOrderCountByStatus(status: string): number {
    return this.orders.filter(order => order.status === status).length;
  }
  
  /**
   * Get total quantity for an order
   */
  getTotalQuantity(order: Order): number {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  }
  
  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  /**
   * Get status label for display
   */
  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled',
      'failed': 'Failed'
    };
    return statusLabels[status] || status;
  }
  
  /**
   * Get user name by user ID
   */
  getUserName(userId: string): string {
    const user = this.users[userId];
    if (user) {
      return user.full_name || 
             (user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : '') ||
             user.username || 
             user.email ||
             `User ${userId.substring(0, 8)}`;
    }
    return `User ${userId.substring(0, 8)}`;
  }
}