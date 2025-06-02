import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,  FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  UserService } from '../../../../user.service';

@Component({
  selector: 'app-myprofile',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './myprofile.component.html',
  styleUrl: './myprofile.component.css'
})
export class MyProfileComponent implements OnInit {
  profileForm!: FormGroup;
  user_id: string = localStorage.getItem('user_id') || '';

 // replace this with dynamic value from Cognito or localStorage
  profileImageFile!: File;
  imagePreview: string | ArrayBuffer | null = null;
  earnings: number = 0;

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      full_name: [''],
      email: [''],
      phone_number: ['']
    });

    this.userService.getUser(this.user_id).subscribe((user: any) => {
      this.profileForm.patchValue({
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number
      });
      this.earnings = user.earnings;

      if (user.profile_image) {
        this.imagePreview = 'data:image/png;base64,' + user.profile_image;
      }
    });
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.profileImageFile = file;
      const reader = new FileReader();
      reader.onload = e => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    const formValue = this.profileForm.value;

    formData.append('full_name', formValue.full_name);
    formData.append('email', formValue.email);
    formData.append('phone_number', formValue.phone_number);
    if (this.profileImageFile) {
      formData.append('profile_image', this.profileImageFile);
    }
    console.log("came here")
    this.userService.update_user(this.user_id, formData).subscribe({
      next: res => alert(res.message),
      error: err => alert(err.error?.error || 'Profile update failed.')
    });
  }
}
