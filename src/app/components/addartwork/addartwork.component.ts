import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addartwork',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addartwork.component.html',
  styleUrl: './addartwork.component.css'
})
export class AddartworkComponent implements OnInit {
  artwork = {
    title: '',
    description: '',
    category_name: '',
    price: 0,
    quantity: 0,
    style: ''
  };

  selectedFile: File | null = null;
  categories: string[] = [];
  styles: string[] = [];
  isLoading = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchStyles();
  }

  fetchCategories() {
    this.http.get<string[]>('http://127.0.0.1:5000/api/categories').subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Error fetching categories', err)
    });
  }

  fetchStyles() {
    this.http.get<string[]>('http://localhost:5000/api/styles').subscribe({
      next: (data) => this.styles = data,
      error: (err) => console.error('Error fetching styles', err)
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (!this.selectedFile) {
      alert('Please select an image file');
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    formData.append('title', this.artwork.title);
    formData.append('description', this.artwork.description);
    formData.append('category_name', this.artwork.category_name.toLowerCase());
    formData.append('price', this.artwork.price.toString());
    formData.append('quantity', this.artwork.quantity.toString());
    formData.append('style', this.artwork.style.toLowerCase());
    formData.append('art_image', this.selectedFile);

    const token_raw = localStorage.getItem('access_token');
    if (!token_raw) {
      alert('You must be logged in!');
      return;
    }
    const token = token_raw.replace(/^"|"$/g, '').trim();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    console.log('Token being sent:', token);  


    this.http.post('http://localhost:5000/api/artworks', formData, { headers })
      .subscribe({
        next: (response) => {
          console.log('Artwork added successfully', response);
          alert('Artwork added successfully!');
          this.resetForm();
          this.router.navigate(['/artistdashboard']);
        },
        error: (error) => {
          console.error('Error adding artwork:', error);
          this.isLoading = false;
          alert('Error adding artwork. Please try again.');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  resetForm() {
    this.artwork = {
      title: '',
      description: '',
      category_name: '',
      price: 0,
      quantity: 0,
      style: ''
    };
    this.selectedFile = null;
  }
}
