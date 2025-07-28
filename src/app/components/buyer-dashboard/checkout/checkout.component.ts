
// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';

// export interface CartItem {
//   cart_id: number;
//   artwork_id: string;
//   artwork_name: string;
//   price: number;
//   quantity: number;
//   image_url?: string;
//   user_id: string;
//   artwork?: any;
// }

// export interface PaymentData {
//   user_id: string;
//   order_id: string;
//   full_name: string;
//   email: string;
//   phone_number: string;
//   city: string;
//   state: string;
//   country: string;
//   pincode: number;
//   shipping_fee: number;
//   subtotal: number;
//   total: number;
//   payment_method: string;
//   status: string;
//   upi_id?: string;
//   wallet?: number;
// }

// @Component({
//   selector: 'app-checkout',
//   templateUrl: './checkout.component.html',
//   imports: [CommonModule, ReactiveFormsModule],
//   styleUrls: ['./checkout.component.css']
// })
// export class CheckoutComponent implements OnInit {
//   currentStep = 1;
//   totalSteps = 4;
  
//   billingForm!: FormGroup;
//   shippingForm!: FormGroup;
//   paymentForm!: FormGroup;
//   user_id: string = '';
//   cartItems: CartItem[] = [];
//   subtotal = 0;
//   shippingFee = 0;
//   tax = 0;
//   total = 0;
  
//   paymentMethods = [
//     { value: 'cod', label: 'Cash On Delivery', available: true },
//     { value: 'wallet', label: 'Wallet', available: true },
//     { value: 'upi', label: 'UPI Payment', available: true }
//   ];
  
//   selectedPaymentMethod = 'cod';
//   isProcessing = false;
//   orderNumber = '';

//   constructor(
//     private fb: FormBuilder,
//     private router: Router,
//     private http: HttpClient
//   ) {}

//   ngOnInit(): void {
//     this.user_id = this.getCurrentUserId();
//     this.initializeForms();
//     if (this.user_id) {
//       this.loadCartFromBackend();
//     }
//   }

//   initializeForms(): void {
//     this.billingForm = this.fb.group({
//       firstName: ['', [Validators.required, Validators.minLength(2)]],
//       city: ['', [Validators.required, Validators.minLength(2)]],
//       state: [''], 
//       zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
//       country: ['India', Validators.required],
//       phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
//       email: ['', [Validators.required, Validators.email]]
//     });

//     this.shippingForm = this.fb.group({
//       sameAsBilling: [true]
//     });

//     this.paymentForm = this.fb.group({
//       paymentMethod: ['cod', Validators.required],
//       upiId: [''],
//       walletAmount: [0]
//     });

//     // Add conditional validators for UPI
//     this.paymentForm.get('paymentMethod')?.valueChanges.subscribe(method => {
//       this.selectedPaymentMethod = method;
      
//       const upiIdControl = this.paymentForm.get('upiId');
//       if (method === 'upi') {
//         upiIdControl?.setValidators([Validators.required, Validators.pattern(/^[\w.-]+@[\w.-]+$/)]);
//       } else {
//         upiIdControl?.clearValidators();
//       }
//       upiIdControl?.updateValueAndValidity();
//     });

//     // Load user data if available
//     this.loadUserData();
//   }

//   loadUserData(): void {
//     const userData = localStorage.getItem('currentUser');
//     if (userData) {
//       const user = JSON.parse(userData);
//       this.billingForm.patchValue({
//         email: user.email,
//         firstName: user.first_name || user.name || '',
//       });
//     }
//   }

//   loadCartFromBackend(): void {
//     this.http.get<CartItem[]>(`http://localhost:5000/api/cart/user/${this.user_id}`).subscribe({
//       next: (data) => {
//         this.cartItems = data.map(item => ({
//           ...item,
//           artwork_name: item.artwork?.name || item.artwork?.title || 'Unknown Artwork',
//           image_url: item.artwork?.image_url || ''
//         }));
//         this.calculateTotals();
//       },
//       error: (err) => {
//         console.error('Failed to load cart items from backend', err);
//         alert('Failed to load cart items. Please try again.');
//       }
//     });
//   }

//   deleteCartItem(cartId: number): void {
//     if (confirm('Are you sure you want to remove this item from your cart?')) {
//       this.http.delete(`http://localhost:5000/api/cart/${cartId}`).subscribe({
//         next: () => {
//           this.cartItems = this.cartItems.filter(item => item.cart_id !== cartId);
//           this.calculateTotals();
//         },
//         error: (err) => {
//           console.error('Failed to delete cart item', err);
//           alert('Failed to remove item. Please try again.');
//         }
//       });
//     }
//   }

//   updateCartItemQuantity(cartId: number, newQuantity: number): void {
//     if (newQuantity < 1) {
//       this.deleteCartItem(cartId);
//       return;
//     }

//     const updateData = { quantity: newQuantity };
//     this.http.put(`http://localhost:5000/api/cart/${cartId}`, updateData).subscribe({
//       next: () => {
//         const item = this.cartItems.find(item => item.cart_id === cartId);
//         if (item) {
//           item.quantity = newQuantity;
//           this.calculateTotals();
//         }
//       },
//       error: (err) => {
//         console.error('Failed to update cart item quantity', err);
//         alert('Failed to update quantity. Please try again.');
//       }
//     });
//   }

//   calculateTotals(): void {
//     this.subtotal = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//     this.shippingFee = this.subtotal > 500 ? 0 : 50; // Free shipping over ₹500
//     this.tax = Math.round(this.subtotal * 0.12); // 12% tax
//     this.total = this.subtotal + this.shippingFee + this.tax;
//   }

//   nextStep(): void {
//     console.log('Next step called, current step:', this.currentStep);
    
//     if (this.validateCurrentStep()) {
//       if (this.currentStep < this.totalSteps) {
//         this.currentStep++;
//         console.log('Moving to step:', this.currentStep);
//       }
//     } else {
//       console.log('Validation failed for step:', this.currentStep);
//     }
//   }

//   previousStep(): void {
//     if (this.currentStep > 1) {
//       this.currentStep--;
//     }
//   }

//   validateCurrentStep(): boolean {
//     switch (this.currentStep) {
//       case 1:
//         console.log('Validating billing form');
//         console.log('Form valid:', this.billingForm.valid);
//         console.log('Form errors:', this.billingForm.errors);
//         console.log('Form values:', this.billingForm.value);
        
//         Object.keys(this.billingForm.controls).forEach(key => {
//           const control = this.billingForm.get(key);
//           if (control && control.errors) {
//             console.log(`${key} errors:`, control.errors);
//           }
//         });
        
//         if (this.billingForm.invalid) {
//           this.billingForm.markAllAsTouched();
//           return false;
//         }
//         return true;
//       case 2:
//         return true; 
//       case 3:
//         console.log('Validating payment form');
//         console.log('Payment form valid:', this.paymentForm.valid);
//         console.log('Selected payment method:', this.selectedPaymentMethod);
        
//         if (this.paymentForm.invalid) {
//           this.paymentForm.markAllAsTouched();
//           return false;
//         }
//         return true;
//       default:
//         return true;
//     }
//   }

//   async placeOrder(): Promise<void> {
//     if (!this.validateCurrentStep() || this.cartItems.length === 0) {
//       if (this.cartItems.length === 0) {
//         alert('Your cart is empty. Please add items to continue.');
//       }
//       return;
//     }

//     this.isProcessing = true;

//     try {
//       // Create order
//       const orderData = {
//         user_id: this.user_id,
//         total_price: this.total
//       };

//       const orderResponse = await this.http.post<any>('http://localhost:5000/api/orders/', orderData).toPromise();
//       const orderId = orderResponse.order_id;

//       // Create order items
//       for (const item of this.cartItems) {
//         const orderItemData = {
//           order_id: orderId,
//           artwork_id: item.artwork_id,
//           quantity: item.quantity,
//           price: item.price
//         };
//         await this.http.post('http://localhost:5000/api/order-items/', orderItemData).toPromise();
//       }

//       // Create payment record
//       const paymentData: PaymentData = {
//         user_id: this.user_id,
//         order_id: orderId,
//         full_name: this.billingForm.value.firstName,
//         email: this.billingForm.value.email,
//         phone_number: this.billingForm.value.phone,
//         city: this.billingForm.value.city,
//         state: this.billingForm.value.state || '',
//         country: this.billingForm.value.country,
//         pincode: parseInt(this.billingForm.value.zipCode),
//         shipping_fee: this.shippingFee,
//         subtotal: this.subtotal,
//         total: this.total,
//         payment_method: this.selectedPaymentMethod,
//         status: 'pending'
//       };

//       // Add UPI ID if selected
//       if (this.selectedPaymentMethod === 'upi' && this.paymentForm.value.upiId) {
//         paymentData.upi_id = this.paymentForm.value.upiId;
//       }

//       // Add wallet amount if used
//       if (this.paymentForm.value.walletAmount > 0) {
//         paymentData.wallet = this.paymentForm.value.walletAmount;
//       }

//       await this.http.post('http://localhost:5000/api/payments/', paymentData).toPromise();

//       // Clear cart from backend
//       await this.http.delete(`http://localhost:5000/api/cart/user/${this.user_id}`).toPromise();

//       // Generate order number
//       this.orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
//       // Move to confirmation step
//       this.currentStep = 4;

//     } catch (error) {
//       console.error('Order placement failed:', error);
//       alert('Failed to place order. Please try again.');
//     } finally {
//       this.isProcessing = false;
//     }
//   }

//   getCurrentUserId(): string {
//     const userData = localStorage.getItem('currentUser');
//     if (userData) {
//       const user = JSON.parse(userData);
//       return user.user_id || '';
//     }
//     return localStorage.getItem('user_id') || '';
//   }

//   continueShopping(): void {
//     this.router.navigate(['/artworks']);
//   }

//   trackOrder(): void {
//     this.router.navigate(['/orders', this.orderNumber]);
//   }

//   getStepClass(step: number): string {
//     if (step < this.currentStep) return 'completed';
//     if (step === this.currentStep) return 'active';
//     return 'inactive';
//   }

//   isStepCompleted(step: number): boolean {
//     return step < this.currentStep;
//   }

//   printOrderConfirmation(): void {
//     window.print();
//   }

//   getSelectedPaymentLabel(): string {
//     const method = this.paymentMethods.find(m => m.value === this.selectedPaymentMethod);
//     return method ? method.label : '';
//   }
  
// }

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface CartItem {
  cart_id: number;
  artwork_id: string;
  artwork_name: string;
  price: number;
  quantity: number;
  image_url?: string| null;
  user_id: string;
  artwork?: any;
}

export interface PaymentData {
  user_id: string;
  order_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  city: string;
  state: string;
  country: string;
  pincode: number;
  shipping_fee: number;
  subtotal: number;
  total: number;
  payment_method: string;
  status: string;
  upi_id?: string;
  wallet?: number;
}

export interface User {
  user_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  role_id: number;
  profile_image?: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  templateUrl: './checkout.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  currentStep = 1;
  totalSteps = 4;
  
  billingForm!: FormGroup;
  shippingForm!: FormGroup;
  paymentForm!: FormGroup;
  user_id: string = '';
  cartItems: CartItem[] = [];
  subtotal = 0;
  shippingFee = 0;
  total = 0;
  currentUser: User | null = null;
  
  paymentMethods = [
    { value: 'cod', label: 'Cash On Delivery', available: true },
    { value: 'wallet', label: 'Wallet', available: true },
    { value: 'upi', label: 'UPI Payment', available: true }
  ];
  
  selectedPaymentMethod = 'cod';
  isProcessing = false;
  orderNumber = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.user_id = this.getCurrentUserId();
    this.initializeForms();
    if (this.user_id) {
      this.loadUserProfile().then(() => {
        this.loadCartFromBackend();
      });
    } else {
      // If no user is logged in, redirect to login
      this.router.navigate(['/login']);
    }
  }

  initializeForms(): void {
    this.billingForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      state: [''], 
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      country: ['India', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.shippingForm = this.fb.group({
      sameAsBilling: [true]
    });

    this.paymentForm = this.fb.group({
      paymentMethod: ['cod', Validators.required],
      upiId: [''],
      walletAmount: [0]
    });

    // Add conditional validators for UPI
    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      this.selectedPaymentMethod = method;
      
      const upiIdControl = this.paymentForm.get('upiId');
      if (method === 'upi') {
        upiIdControl?.setValidators([Validators.required, Validators.pattern(/^[\w.-]+@[\w.-]+$/)]);
      } else {
        upiIdControl?.clearValidators();
      }
      upiIdControl?.updateValueAndValidity();
    });
  }

  // Load user profile from backend
  async loadUserProfile(): Promise<void> {
    try {
      // Try different token keys that might be used
      let token = localStorage.getItem('access_token') || 
                  localStorage.getItem('token') || 
                  localStorage.getItem('authToken');
      
      if (!token) {
        console.warn('No authentication token found, using basic user data from localStorage');
        // Fallback to localStorage user data
        this.loadUserDataFromStorage();
        return;
      }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      const response = await this.http.get<User>(`http://localhost:5000/api/users/${this.user_id}`, { headers }).toPromise();
      this.currentUser = response || null;
      
      // Pre-fill the billing form with user data
      if (this.currentUser) {
        this.billingForm.patchValue({
          firstName: this.currentUser.full_name || '',
          email: this.currentUser.email || '',
          phone: this.currentUser.phone_number || ''
        });
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
      this.currentUser = null;
      // Fallback to localStorage user data
      this.loadUserDataFromStorage();
    }
  }

  // Fallback method to load user data from localStorage
  loadUserDataFromStorage(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.billingForm.patchValue({
          firstName: user.full_name || user.name || user.firstName || '',
          email: user.email || '',
          phone: user.phone_number || user.phone || ''
        });
        console.log('Loaded user data from localStorage:', user);
      } catch (e) {
        console.error('Error parsing user data from localStorage:', e);
      }
    }
  }

  loadCartFromBackend(): void {
    // Try different token keys
    let token = localStorage.getItem('access_token') || 
                localStorage.getItem('token') || 
                localStorage.getItem('authToken');
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.get<any>(`http://localhost:5000/api/cart/user/${this.user_id}`, { headers }).subscribe({
      next: (response) => {
        // Handle different response formats
        let data: CartItem[] = [];
        
        if (Array.isArray(response)) {
          data = response;
        } else if (response && Array.isArray(response.data)) {
          data = response.data;
        } else if (response && Array.isArray(response.cart_items)) {
          data = response.cart_items;
        } else {
          console.warn('Unexpected cart response format:', response);
          data = [];
        }

        this.cartItems = data.map(item => ({
          ...item,
          artwork_name: item.artwork?.name || item.artwork?.title || item.artwork_name || 'Unknown Artwork',
          image_url: item.artwork?.image_url || item.image_url || ''
        }));
        
        // Calculate totals after loading cart items
        this.calculateTotals();
        console.log('Cart loaded:', this.cartItems);
        console.log('Totals calculated - Subtotal:', this.subtotal, 'Total:', this.total);
      },
      error: (err) => {
        console.error('Failed to load cart items from backend', err);
        // Don't show alert immediately, user might not have items in cart
        this.cartItems = [];
        this.calculateTotals();
      }
    });
  }

  deleteCartItem(cartId: number): void {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
      let token = localStorage.getItem('access_token') || 
                  localStorage.getItem('token') || 
                  localStorage.getItem('authToken');
      
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      this.http.delete(`http://localhost:5000/api/cart/${cartId}`, { headers }).subscribe({
        next: () => {
          this.cartItems = this.cartItems.filter(item => item.cart_id !== cartId);
          this.calculateTotals();
        },
        error: (err) => {
          console.error('Failed to delete cart item', err);
          alert('Failed to remove item. Please try again.');
        }
      });
    }
  }

  updateCartItemQuantity(cartId: number, newQuantity: number): void {
    if (newQuantity < 1) {
      this.deleteCartItem(cartId);
      return;
    }

    let token = localStorage.getItem('access_token') || 
                localStorage.getItem('token') || 
                localStorage.getItem('authToken');
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const updateData = { quantity: newQuantity };
    this.http.put(`http://localhost:5000/api/cart/${cartId}`, updateData, { headers }).subscribe({
      next: () => {
        const item = this.cartItems.find(item => item.cart_id === cartId);
        if (item) {
          item.quantity = newQuantity;
          this.calculateTotals();
        }
      },
      error: (err) => {
        console.error('Failed to update cart item quantity', err);
        alert('Failed to update quantity. Please try again.');
      }
    });
  }

  calculateTotals(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.shippingFee = this.subtotal > 500 ? 0 : 50; // Free shipping over ₹500
    
    this.total = this.subtotal + this.shippingFee ;
    
    console.log('Totals calculated:', {
      subtotal: this.subtotal,
      shippingFee: this.shippingFee,
      total: this.total
    });
  }

  nextStep(): void {
    console.log('Next step called, current step:', this.currentStep);
    
    if (this.validateCurrentStep()) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        console.log('Moving to step:', this.currentStep);
      }
    } else {
      console.log('Validation failed for step:', this.currentStep);
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  validateCurrentStep(): boolean {
    switch (this.currentStep) {
      case 1:
        console.log('Validating billing form');
        console.log('Form valid:', this.billingForm.valid);
        console.log('Form errors:', this.billingForm.errors);
        console.log('Form values:', this.billingForm.value);
        
        Object.keys(this.billingForm.controls).forEach(key => {
          const control = this.billingForm.get(key);
          if (control && control.errors) {
            console.log(`${key} errors:`, control.errors);
          }
        });
        
        if (this.billingForm.invalid) {
          this.billingForm.markAllAsTouched();
          return false;
        }
        return true;
      case 2:
        return true; 
      case 3:
        console.log('Validating payment form');
        console.log('Payment form valid:', this.paymentForm.valid);
        console.log('Selected payment method:', this.selectedPaymentMethod);
        
        if (this.paymentForm.invalid) {
          this.paymentForm.markAllAsTouched();
          return false;
        }
        return true;
      default:
        return true;
    }
  }

  async placeOrder(): Promise<void> {
    if (!this.validateCurrentStep() || this.cartItems.length === 0) {
      if (this.cartItems.length === 0) {
        alert('Your cart is empty. Please add items to continue.');
      }
      return;
    }

    this.isProcessing = true;

    try {
      let token = localStorage.getItem('access_token') || 
                  localStorage.getItem('token') || 
                  localStorage.getItem('authToken');
      
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      // Create order
      const orderData = {
        user_id: this.user_id,
        total_price: this.total
      };

      const orderResponse = await this.http.post<any>('http://localhost:5000/api/orders/', orderData, { headers }).toPromise();
      const orderId = orderResponse.order_id;

      // Create order items
      for (const item of this.cartItems) {
        const orderItemData = {
          order_id: orderId,
          artwork_id: item.artwork_id,
          quantity: item.quantity,
          price: item.price
        };
        await this.http.post('http://localhost:5000/api/order-items/', orderItemData, { headers }).toPromise();
      }

      // Create payment record
      const paymentData: PaymentData = {
        user_id: this.user_id,
        order_id: orderId,
        full_name: this.billingForm.value.firstName,
        email: this.billingForm.value.email,
        phone_number: this.billingForm.value.phone,
        city: this.billingForm.value.city,
        state: this.billingForm.value.state || '',
        country: this.billingForm.value.country,
        pincode: parseInt(this.billingForm.value.zipCode),
        shipping_fee: this.shippingFee,
        subtotal: this.subtotal,
        total: this.total,
        payment_method: this.selectedPaymentMethod,
        status: 'pending'
      };

      // Add UPI ID if selected
      if (this.selectedPaymentMethod === 'upi' && this.paymentForm.value.upiId) {
        paymentData.upi_id = this.paymentForm.value.upiId;
      }

      // Add wallet amount if used
      if (this.paymentForm.value.walletAmount > 0) {
        paymentData.wallet = this.paymentForm.value.walletAmount;
      }

      await this.http.post('http://localhost:5000/api/payments/', paymentData, { headers }).toPromise();

      // Clear cart from backend
      await this.http.delete(`http://localhost:5000/api/cart/user/${this.user_id}`, { headers }).toPromise();

      // Generate order number
      this.orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
      // Move to confirmation step
      this.currentStep = 4;

    } catch (error) {
      console.error('Order placement failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      this.isProcessing = false;
    }
  }

  getCurrentUserId(): string {
    // First try to get from currentUser in localStorage
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.user_id || '';
      } catch (e) {
        console.error('Error parsing currentUser from localStorage:', e);
      }
    }
    
    // Fallback to user_id directly
    return localStorage.getItem('user_id') || '';
  }

  continueShopping(): void {
    this.router.navigate(['/artworks']);
  }

  trackOrder(): void {
    this.router.navigate(['/orders', this.orderNumber]);
  }

  getStepClass(step: number): string {
    if (step < this.currentStep) return 'completed';
    if (step === this.currentStep) return 'active';
    return 'inactive';
  }

  isStepCompleted(step: number): boolean {
    return step < this.currentStep;
  }

  printOrderConfirmation(): void {
    window.print();
  }

  getSelectedPaymentLabel(): string {
    const method = this.paymentMethods.find(m => m.value === this.selectedPaymentMethod);
    return method ? method.label : '';
  }

  handleImageError(item: any): void {
    item.image_url = null;
  }
  
  
}