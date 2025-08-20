import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-myprofile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})
export class MyProfileComponent implements OnInit {
  profileForm!: FormGroup;
  isEditMode = false;
  user_id: string = localStorage.getItem('user_id') || '';
  userRole: string = localStorage.getItem('role') || 'Buyer'; // Artist or Buyer
  imagePreview: string | ArrayBuffer | null = null;
  profileImageFile!: File;
  earnings: number = 0;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      full_name: [''],
      email: [''],
      phone_number: ['']
    });

    this.loadProfile();
  }

  get isArtist(): boolean {
    return this.userRole === 'Artist';
  }

  loadProfile(): void {
    const token = localStorage.getItem('access_token') || '';

    this.http.get<any>(
      `http://localhost:5000/api/users/${this.user_id}`,
      { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) }
    ).subscribe({
      next: (user) => {
        this.profileForm.patchValue({
          full_name: user.full_name,
          email: user.email,
          phone_number: user.phone_number
        });

        // Only set earnings if Artist
        if (this.isArtist) {
          this.earnings = user.earnings || 0;
        }

        if (user.profile_image) {
          this.imagePreview = `http://localhost:5000/static/uploads/${user.profile_image}?t=${Date.now()}`;
        }
      },
      error: (err) => {
        console.error(err);
        alert('Could not load profile.');
      }
    });
  }

  enableEdit(): void {
    this.isEditMode = true;
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.profileImageFile = file;
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('full_name', this.profileForm.value.full_name);
    formData.append('email', this.profileForm.value.email);
    formData.append('phone_number', this.profileForm.value.phone_number);

    if (this.profileImageFile) {
      formData.append('profile_image', this.profileImageFile);
    }

    const token = localStorage.getItem('access_token') || '';
    this.http.patch<any>(
      `http://localhost:5000/api/users/${this.user_id}`,
      formData,
      { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) }
    ).subscribe({
      next: (res) => {
        alert(res.message || 'Profile updated.');
        this.isEditMode = false;
        setTimeout(() => this.loadProfile(), 300);
      },
      error: (err) => {
        console.error(err);
        alert('Update failed.');
      }
    });
  }
}
