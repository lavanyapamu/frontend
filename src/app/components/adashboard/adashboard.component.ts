import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MainnavComponent } from './mainnav/mainnav.component';
import { SidenavComponent } from './sidenav/sidenav.component';


@Component({
  selector: 'app-adashboard',
  imports: [RouterOutlet, MainnavComponent, SidenavComponent, RouterModule],
  templateUrl: './adashboard.component.html',
  styleUrl: './adashboard.component.css'
})
export class AdashboardComponent {

}
