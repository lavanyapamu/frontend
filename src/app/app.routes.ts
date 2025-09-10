import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/main/home/home.component';
import { EmailverifyComponent } from './components/emailverify/emailverify.component';
import { ArtistComponent } from './components/adashboard/artist/artist.component';

import { MyProfileComponent } from './components/adashboard/myprofile/myprofile.component';


import { AddartworkComponent } from './components/adashboard/addartwork/addartwork.component';
import { ArtworksComponent } from './components/adashboard/artworks/artworks.component';
import { MainComponent } from './components/main/main.component';

import { EditartworkComponent } from './components/adashboard/editartwork/editartwork.component';
import { AdashboardComponent } from './components/adashboard/adashboard.component';
import { OrdersComponent } from './components/adashboard/orders/orders.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { BuyerDashboardComponent } from './components/buyer-dashboard/buyer-dashboard.component';
import { CheckoutComponent } from './components/buyer-dashboard/checkout/checkout.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { ArtworkDetailComponent } from './components/artwork-detail/artwork-detail.component';
import { CartComponent } from './components/buyer-dashboard/cart/cart.component';
import { WishlistComponent } from './components/buyer-dashboard/wishlist/wishlist.component';
import { ProfileComponent } from './components/buyer-dashboard/profile/profile.component';
import { BuyerArtworksComponent } from './components/buyer-dashboard/artworks/artworks.component';
import { ArtworkDetailsComponent } from './components/buyer-dashboard/artwork-details/artwork-details.component';
import { buyerOrdersComponent } from './components/buyer-dashboard/orders_buyer/orders.component';
import { LegalComponent } from './components/legal/legal.component';

export const routes: Routes = [
    {path:'register', component:RegisterComponent},
    {path:'login', component:LoginComponent},
    {path:'legal', component:LegalComponent},
    {
        path: 'main',
        component: MainComponent,
        children: [
          { path: 'home', component: HomeComponent },
          { path: '', redirectTo: 'home', pathMatch: 'full' }
        ]
    },
    {
      path:'artistd',
      component:AdashboardComponent,
      canActivate: [AuthGuard, RoleGuard],
      data: { role: 2 }, // only artist
      children:[
        
          {path:'artist', component:ArtistComponent},
          { path: 'orders', component: OrdersComponent },
          {path:'artworks', component:ArtworksComponent},
          { path: 'dashboard', component: ArtistComponent },
          { path: 'myprofile', component: MyProfileComponent },
          {path:'editartwork/:id', component:EditartworkComponent},
          {path:'addartwork', component:AddartworkComponent},
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        
      ]
    },

    {path:'emailverify',component:EmailverifyComponent},

    {path:'orders', component:OrdersComponent},
    {path:'myprofile', component:MyProfileComponent},
   
  
  
    {
      path: 'buyerdashboard',
      component: BuyerDashboardComponent,
      canActivate: [AuthGuard, RoleGuard],
      data: { role: 3 },
      children: [
        
        {path:'artworksb', component:BuyerArtworksComponent},
        { path: 'cart', component: CartComponent },
        { path: 'wishlist', component: WishlistComponent },
        { path: 'buyer_orders', component: buyerOrdersComponent },
        { path: 'myprofile', component: MyProfileComponent },
        { path: 'checkout', component: CheckoutComponent },
        {path:'artwork-detail/:artwork_id', component:ArtworkDetailsComponent},
        { path: '', redirectTo: 'artworksb', pathMatch: 'full' }

       
      ]
    },
    
   
   
    {path:'forgot-password', component:ForgotPasswordComponent},
    { path: 'reset-password', component: ResetPasswordComponent},
    { path: 'artwork-details/:id', component: ArtworkDetailComponent },
    // {path:'', redirectTo:'/main/home', pathMatch:'full'}
    
];
