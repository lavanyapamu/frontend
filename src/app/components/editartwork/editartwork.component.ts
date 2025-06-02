// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// @Component({
//   selector: 'app-editartwork',
//   standalone: true,
//   imports: [CommonModule, FormsModule, ReactiveFormsModule],
//   templateUrl: './editartwork.component.html',
//   styleUrls: ['./editartwork.component.css']
// })
// export class EditartworkComponent implements OnInit {

//   artworkForm!: FormGroup;
//   artworkId: string = '';
//   loading: boolean = true;
//   errorMessage: string = '';

//   constructor(
//     private route: ActivatedRoute,
//     private fb: FormBuilder,
//     private http: HttpClient,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.artworkId = this.route.snapshot.paramMap.get('id') || '';
//     this.initForm();
//     this.getArtworkDetails();
//   }

//   initForm(): void {
//     this.artworkForm = this.fb.group({
//       title: ['', Validators.required],
//       category: ['', Validators.required],
//       price: [0, Validators.required],
//       quantity: [0, Validators.required],
//       style: [''],
//       image: ['']
//     });
//   }

//   getArtworkDetails(): void {
//     this.http.get<any>(`http://localhost:5000/api/artworks/${this.artworkId}`).subscribe({
//       next: (data) => {
//         this.artworkForm.patchValue(data);
//         this.loading = false;
//       },
//       error: (err) => {
//         this.errorMessage = 'Failed to fetch artwork';
//         console.error(err);
//         this.loading = false;
//       }
//     });
//   }

//   updateArtwork(): void {
//     if (this.artworkForm.invalid) return;

//     this.http.put<any>(`http://localhost:5000/api/artworks/${this.artworkId}`, this.artworkForm.value).subscribe({
//       next: () => {
//         alert('Artwork updated successfully!');
//         this.router.navigate(['/artistdashboard']);
//       },
//       error: (err) => {
//         this.errorMessage = 'Failed to update artwork';
//         console.error(err);
//       }
//     });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-editartwork',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './editartwork.component.html',
  styleUrls: ['./editartwork.component.css']
})
export class EditartworkComponent implements OnInit {
  artworkForm!: FormGroup;
  artworkId: string = '';
  loading: boolean = true;
  errorMessage: string = '';
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.artworkId = this.route.snapshot.paramMap.get('id') || '';
    this.initForm();
    this.getArtworkDetails();
  }

  initForm(): void {
    this.artworkForm = this.fb.group({
      title: ['', Validators.required],
      category_name: ['', Validators.required],
      price: [0, Validators.required],
      quantity: [0, Validators.required],
      style: [''],
      description: ['']
    });
  }

  getArtworkDetails(): void {
    this.http.get<any>(`http://localhost:5000/api/artworks/${this.artworkId}`).subscribe({
      next: (data) => {
        this.artworkForm.patchValue({
          title: data.title,
          category_name: data.category_name,
          price: data.price,
          quantity: data.quantity,
          style: data.style,
          description: data.description
        });
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to fetch artwork';
        console.error(err);
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  updateArtwork(): void {
    if (this.artworkForm.invalid) return;
    
    const token = localStorage.getItem('access_token');  // or sessionStorage
    const headers = {
    'Authorization': `Bearer ${token}`
    };

    const formData = new FormData();
    formData.append('title', this.artworkForm.get('title')?.value);
    formData.append('category_name', this.artworkForm.get('category_name')?.value);
    formData.append('price', this.artworkForm.get('price')?.value);
    formData.append('quantity', this.artworkForm.get('quantity')?.value);
    formData.append('style', this.artworkForm.get('style')?.value);
    formData.append('description', this.artworkForm.get('description')?.value);

    if (this.selectedFile) {
      formData.append('art_image', this.selectedFile);
    }

    this.http.patch<any>(`http://localhost:5000/api/artworks/${this.artworkId}`, formData, { headers }).subscribe({
      next: () => {
        alert('Artwork updated successfully!');
        this.router.navigate(['/artistdashboard']);
      },
      error: (err) => {
        this.errorMessage = 'Failed to update artwork';
        console.error(err);
      }
    });
  }
}
