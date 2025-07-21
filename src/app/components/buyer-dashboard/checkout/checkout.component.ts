import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  imports:[CommonModule, ReactiveFormsModule],
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  cartTotal = 2999; // Replace this with actual cart total logic

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiry: ['', Validators.required],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]]
    });
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      console.log('Checkout data:', this.checkoutForm.value);
      alert('Order placed successfully!');
      this.checkoutForm.reset();
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }
}

