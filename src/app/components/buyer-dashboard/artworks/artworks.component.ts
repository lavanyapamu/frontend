import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-artworks-buyer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './artworks.component.html',
  styleUrls: ['./artworks.component.css']
})
export class BuyerArtworksComponent {
  artworks: any[] = [];
  filteredArtworks: any[] = [];
  cartItems: any[] = [];
  wishlistItems: any[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  imageURL = "http://localhost:5000/static/uploads/";
  user_id: string = '';

  // Search and Filter properties
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedStyle: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortBy: string = '';
  
  // Debounce timer for search
  private searchTimeout: any;

  constructor(private http: HttpClient, private route: ActivatedRoute,private router: Router) {
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
        this.filteredArtworks = [...this.artworks];
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load artworks.';
        console.error(error);
        this.loading = false;
      }
    });
  }

  // Search functionality with debounce
  onSearchChange(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.applyFilters();
    }, 300);
  }

  // Apply all filters and search
  applyFilters(): void {
    this.loading = true;
    
    // Build query parameters
    const params: any = {};
    
    if (this.searchTerm) {
      params.search = this.searchTerm;
    }
    if (this.selectedCategory) {
      params.category = this.selectedCategory;
    }
    if (this.selectedStyle) {
      params.style = this.selectedStyle;
    }
    if (this.minPrice !== null && this.minPrice > 0) {
      params.min_price = this.minPrice;
    }
    if (this.maxPrice !== null && this.maxPrice > 0) {
      params.max_price = this.maxPrice;
    }
    if (this.sortBy) {
      params.sort_by = this.sortBy;
    }

    // Convert params to query string
    const queryString = new URLSearchParams(params).toString();
    const url = `http://localhost:5000/api/artworks${queryString ? '?' + queryString : ''}`;

    this.http.get<any[]>(url).subscribe({
      next: (response) => {
        this.filteredArtworks = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Filter error:', error);
        // Fallback to client-side filtering if server-side fails
        this.clientSideFilter();
        this.loading = false;
      }
    });
  }

  // Client-side filtering as fallback
  private clientSideFilter(): void {
    let filtered = [...this.artworks];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(artwork => 
        artwork.title.toLowerCase().includes(term) ||
        artwork.description.toLowerCase().includes(term) ||
        artwork.category_name.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(artwork => 
        artwork.category_name.toLowerCase() === this.selectedCategory.toLowerCase()
      );
    }

    // Style filter
    if (this.selectedStyle) {
      filtered = filtered.filter(artwork => 
        artwork.style.toLowerCase() === this.selectedStyle.toLowerCase()
      );
    }

    // Price range filter
    if (this.minPrice !== null && this.minPrice > 0) {
      filtered = filtered.filter(artwork => artwork.price >= this.minPrice!);
    }
    if (this.maxPrice !== null && this.maxPrice > 0) {
      filtered = filtered.filter(artwork => artwork.price <= this.maxPrice!);
    }

    // Sort
    if (this.sortBy) {
      filtered = this.sortArtworks(filtered, this.sortBy);
    }

    this.filteredArtworks = filtered;
  }

  private sortArtworks(artworks: any[], sortBy: string): any[] {
    switch (sortBy) {
      case 'price_asc':
        return artworks.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return artworks.sort((a, b) => b.price - a.price);
      case 'newest':
        return artworks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'popular':
        return artworks.sort((a, b) => b.sales_count - a.sales_count);
      default:
        return artworks;
    }
  }

  // Clear filter methods
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedStyle = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.sortBy = '';
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  clearCategory(): void {
    this.selectedCategory = '';
    this.applyFilters();
  }

  clearStyle(): void {
    this.selectedStyle = '';
    this.applyFilters();
  }

  clearPriceRange(): void {
    this.minPrice = null;
    this.maxPrice = null;
    this.applyFilters();
  }

  clearSort(): void {
    this.sortBy = '';
    this.applyFilters();
  }

  // Check if any filters are active
  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.selectedCategory || this.selectedStyle || 
             this.minPrice || this.maxPrice || this.sortBy);
  }

  // Get sort label for display
  getSortLabel(sortBy: string): string {
    switch (sortBy) {
      case 'newest': return 'Newest First';
      case 'price_asc': return 'Price: Low to High';
      case 'price_desc': return 'Price: High to Low';
      case 'popular': return 'Most Popular';
      default: return 'Default';
    }
  }

  // Existing methods
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
  view(artwork: any): void {
    console.log('Navigating to artwork:', artwork);
    if (artwork && artwork.artwork_id) {
      this.router.navigate(['/buyerdashboard/artwork-detail', artwork.artwork_id]);
    } else {
      console.error('Artwork ID is missing or undefined');
    }
  }

  toggleWishlist(artwork: any): void {
    if (this.isInWishlist(artwork.artwork_id)) {
      const item = this.wishlistItems.find(w => w.artwork_id === artwork.artwork_id);
      if (item) {
        const token = localStorage.getItem('access_token');
        const headers = { Authorization: `Bearer ${token}` };
        this.http.delete(`http://localhost:5000/api/wishlist/${item.wishlist_id}`, { headers }).subscribe({
          next: () => {
            this.loadWishlistItems(); // Refresh UI
          },
          error: (error) => {
            console.error('Failed to remove from wishlist:', error);
          }
        });
      }
    } else {
      this.addToWishlist(artwork);
    }
  }
  
  
}