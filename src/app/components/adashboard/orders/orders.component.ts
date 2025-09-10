import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
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
  status: string;
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
  user_name: string;
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
  imports: [CommonModule, FormsModule],
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
  statuses: string[] = [];

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 2;
  totalPages: number = 1;

  // Subscription for auto-refresh
  private refreshSubscription: Subscription | null = null;

  // API base URL
  private readonly apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadFilters();
    this.loadOrders();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }

  /**
   * Load all orders from backend
   */
  loadOrders(): void {
    this.isLoading = true;

    const artistId = localStorage.getItem('user_id');
    const token = localStorage.getItem('access_token');

    if (!artistId || !token) {
      console.error('No artist ID or token found in localStorage');
      this.isLoading = false;
      return;
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get<any>(`${this.apiUrl}/orders/artist-orders/${artistId}`, { headers }).subscribe({
      next: (response) => {
        this.orders = Array.isArray(response.orders) ? response.orders : [];
        this.filteredOrders = [...this.orders];
        this.updatePagination();
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading artist orders:', error);
        this.isLoading = false;
        alert('Failed to load artist orders.');
        this.orders = [];
      }
    });
  }

  /**
   * Start auto-refresh for new orders (every 30 seconds)
   */
  private startAutoRefresh(): void {
    this.refreshSubscription = interval(30000).subscribe(() => this.loadOrders());
  }

  /**
   * Filter orders based on search term and status
   */
  filterOrders(): void {
    let filtered = [...this.orders];

    // Status filter
    if (this.selectedStatusFilter) {
      filtered = filtered.filter(order => order.status === this.selectedStatusFilter);
    }

    // Search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(order =>
        order.order_id.toLowerCase().includes(searchLower) ||
        this.getUserName(order.user_name).toLowerCase().includes(searchLower) ||
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
   * Load available filters (statuses from backend)
   */
loadFilters(): void {
  const token = localStorage.getItem('access_token');
  const headers = token ? { headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` }) } : {};

  this.http.get<any>(`${this.apiUrl}/artworks/filters`, headers).subscribe({
    next: (response) => {
      this.statuses = response.statuses || [];
    },
    error: (err) => {
      console.error("Failed to load filters", err);
    }
  });
}


  /**
   * Pagination logic
   */
  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }
    this.updatePaginatedOrders();
  }

  private updatePaginatedOrders(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedOrders();
    }
  }

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

  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  getEndIndex(): number {
    return Math.min(this.getStartIndex() + this.itemsPerPage, this.filteredOrders.length);
  }

  /**
   * Update order item status
   */
  updateOrderItemStatus(orderId: string, orderItemId: string, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value;

    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('You are not logged in!');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.apiUrl}/order-items/items/${orderItemId}/status`;

    this.http.put(url, { status: newStatus }, { headers }).subscribe({
      next: () => {
        const order = this.orders.find(o => o.order_id === orderId);
        const item = order?.items.find(i => i.order_item_id === orderItemId);
        if (item) item.status = newStatus;
           // 🔥 Recalculate parent order’s status immediately
        if (order) {
            this.updateOrderStatus(order);
        }
        this.filterOrders();
        console.log('Order item status updated successfully');
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error updating order item status:', error);
        const order = this.orders.find(o => o.order_id === orderId);
        const item = order?.items.find(i => i.order_item_id === orderItemId);
        if (item) selectElement.value = item.status || 'pending';
        alert('Failed to update item status. Please try again.');
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
   * Helpers
   */
  getOrderCountByStatus(status: string): number {
    return this.orders.filter(order => order.status === status).length;
  }

  getTotalQuantity(order: Order): number {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  }
  private updateOrderStatus(order: Order): void {
  if (!order) return;

  const statuses = order.items.map(i => i.status);

  if (statuses.every(s => s === 'delivered')) {
    order.status = 'delivered';
  } else if (statuses.every(s => s === 'confirmed')) {
    order.status = 'confirmed';
  } else if (statuses.every(s => s === 'shipped')) {
    order.status = 'shipped';
  } else if (statuses.every(s => s === 'cancelled')) {
    order.status = 'cancelled';
  } else if (statuses.every(s => s === 'pending')) {
    order.status = 'pending';
  } else {
    order.status = 'processing'; // fallback for mixed statuses
  }

  // 🔥 Keep modal in sync
  if (this.selectedOrder && this.selectedOrder.order_id === order.order_id) {
    this.selectedOrder.status = order.status;
  }
}

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'returned': 'Returned',
      'refunded': 'Refunded',
      'cancelled': 'Cancelled',
      'failed': 'Failed'
    };
    return statusLabels[status] || status;
  }

  getUserName(userId: string): string {
    const user = this.users[userId];
    if (user) {
      return user.full_name ||
        (user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : '') ||
        user.username || user.email || `User ${userId.substring(0, 8)}`;
    }
    return `User ${userId.substring(0, 8)}`;
  }
}
