import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/main/home/home.component';
import { EmailverifyComponent } from './components/emailverify/emailverify.component';
import { ArtistComponent } from './components/adashboard/artist/artist.component';

import { MyProfileComponent } from './components/adashboard/myprofile/myprofile.component';
import { DashboardComponent } from './components/adashboard/dashboard/dashboard.component';
import { MyartworksComponent } from './components/myartworks/myartworks.component';
import { AddartworkComponent } from './components/addartwork/addartwork.component';
import { BuyerComponent } from './components/buyer/buyer.component';
import { ArtworksComponent } from './components/adashboard/artworks/artworks.component';
import { MainComponent } from './components/main/main.component';
import { ArtistsComponent } from './components/artists/artists.component';
import { EditartworkComponent } from './components/editartwork/editartwork.component';
import { AdashboardComponent } from './components/adashboard/adashboard.component';
import { OrdersComponent } from './components/adashboard/orders/orders.component';
import { Component } from '@angular/core';

export const routes: Routes = [
    {path:'register', component:RegisterComponent},
    {path:'login', component:LoginComponent},
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
      children:[
        
          {path:'artist', component:ArtistComponent},
          { path: 'orders', component: OrdersComponent },
          {path:'artworks', component:ArtworksComponent},
          { path: 'dashboard', component: ArtistComponent },
          { path: 'myprofile', component: MyProfileComponent },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        
      ]
    },
    {path:'emailverify',component:EmailverifyComponent},
    // {path:'artistdashboard', component:ArtistComponent},
    {path:'orders', component:OrdersComponent},
    {path:'myprofile', component:MyProfileComponent},
    {path:'dashboard', component:DashboardComponent},
    {path:'myartworks', component:MyartworksComponent},
    {path:'addartwork', component:AddartworkComponent},
    // {path: 'artist/:artistid',component: ArtistComponent},
    {path:'buyerdashboard', component:BuyerComponent},
    {path:'artworks', component:ArtworksComponent},
    {path:'artists', component:ArtistsComponent},
    {path:'editartwork/:id', component:EditartworkComponent},
    {path:'', redirectTo:'/main/home', pathMatch:'full'}
];
