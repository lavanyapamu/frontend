// Home Component TypeScript - home.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Stat {
  icon: string;
  value: string;
  label: string;
}

interface Category {
  name: string;
  slug: string;
  icon: string;
  description: string;
  count: number;
}

interface HowItWorksStep {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  currentYear: number = new Date().getFullYear();
  searchQuery: string = '';

  stats: Stat[] = [
    {
      icon: 'fas fa-users',
      value: '10,000+',
      label: 'Active Artists'
    },
    {
      icon: 'fas fa-images',
      value: '50,000+',
      label: 'Artworks Available'
    },
    {
      icon: 'fas fa-shopping-cart',
      value: '25,000+',
      label: 'Happy Customers'
    },
    {
      icon: 'fas fa-globe',
      value: '150+',
      label: 'Countries Served'
    }
  ];

  categories: Category[] = [
    {
      name: 'Paintings',
      slug: 'paintings',
      icon: 'fas fa-paint-brush',
      description: 'Original paintings in oil, acrylic, watercolor and more',
      count: 15420
    },
    {
      name: 'Sculptures',
      slug: 'sculptures',
      icon: 'fas fa-cube',
      description: 'Three-dimensional art in various materials',
      count: 3250
    },
    {
      name: 'Handicrafts',
      slug: 'handicrafts',
      icon: 'fas fa-hand-paper',
      description: 'Handmade crafts and decorative pieces',
      count: 8900
    },
    {
      name: 'Photography',
      slug: 'photography',
      icon: 'fas fa-camera',
      description: 'Fine art photography and digital prints',
      count: 12100
    }
  ];

  howItWorksSteps: HowItWorksStep[] = [
    {
      icon: 'fas fa-search',
      title: 'Discover Art',
      description: 'Browse thousands of unique artworks from artists worldwide'
    },
    {
      icon: 'fas fa-heart',
      title: 'Find Your Favorite',
      description: 'Use filters and search to find the perfect piece for your space'
    },
    {
      icon: 'fas fa-shopping-cart',
      title: 'Purchase Securely',
      description: 'Buy directly from artists with secure payment and buyer protection'
    }
  ];

  constructor(private router: Router) {}

  onSignup(): void {
    this.router.navigate(['/register']);
  }

  onLogin(): void {
    this.router.navigate(['/login']);
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { 
        queryParams: { q: this.searchQuery.trim() } 
      });
    }
  }

  openLegal(policyType: string): void {
    this.router.navigate(['/legal'], { 
      queryParams: { section: policyType } 
    });
  }
}