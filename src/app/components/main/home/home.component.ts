import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'home-root',
  imports:[CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{
  
  title = 'ArtFlare';
  
  searchQuery: string = '';
  
  stats = [
    { label: 'Total Indicators', value: '25,000' },
    { label: 'Total Customers', value: '2501' },
    { label: 'Total Artists', value: '1035' },
    { label: 'Total Artworks', value: '5,020' }
  ];
  
  onSearch() {
    console.log('Searching for:', this.searchQuery);
    // Implement search functionality here
  }
  
  
}