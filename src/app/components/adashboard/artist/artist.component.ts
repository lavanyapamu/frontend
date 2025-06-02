// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';

// @Component({
//   selector: 'app-artist',
//   imports:[CommonModule, FormsModule],
//   templateUrl: './artist.component.html',
//   styleUrls: ['./artist.component.css']
// })


// export class ArtistComponent implements OnInit {
  
//   // artworks = [
//   //   {
//   //     id: 1,
//   //     title: 'Charminar',
//   //     category: 'Abstract',
//   //     price: 299.99,
//   //     image: 'charminar.jpeg'
//   //   },
//   //   {
//   //     id: 2,
//   //     title: 'Mountain Serenity',
//   //     category: 'Realism',
//   //     price: 450.00,
//   //     image: 'indiagate.jpeg'
//   //   },
//   //   {
//   //     id: 3,
//   //     title: 'Insect',
//   //     category: 'Realism',
//   //     price: 325.50,
//   //     image: 'insect1.jpeg'
//   //   },
//   //   {
//   //     id: 4,
//   //     title: 'Sunset',
//   //     category: 'Realsim',
//   //     price: 380.00,
//   //     image: 'sun.jpeg'
//   //   }
//   // ];
//   artistId: string = '';
//   artworks: any[] = [];
//   loading = true;
//   errorMessage = '';

//   constructor(private route: ActivatedRoute, private http: HttpClient,  private router: Router) {}

//   ngOnInit(): void {
//     // Option 1: Get artist_id from route parameters
//     this.route.paramMap.subscribe(params => {
//       const id = params.get('artistId');
//       if (id) {
//         this.artistId = id;
//         this.fetchArtworksByArtist(id);
//       } else {
//         this.errorMessage = 'Artist ID not found in URL';
//         this.loading = false;
//       }
//      });
//     recentOrders = [
//     {
//       id: 'ORD-001',
//       artwork: 'Abstract Harmony',
//       customer: 'John Smith',
//       quantity: 1,
//       status: 'Delivered'
//     },
//     {
//       id: 'ORD-002',
//       artwork: 'Mountain Serenity',
//       customer: 'Sarah Johnson',
//       quantity: 1,
//       status: 'Pending'
//     },
//     {
//       id: 'ORD-003',
//       artwork: 'Urban Dreams',
//       customer: 'Mike Davis',
//       quantity: 2,
//       status: 'Delivered'
//     },
//     {
//       id: 'ORD-004',
//       artwork: 'Ocean Waves',
//       customer: 'Emily Brown',
//       quantity: 1,
//       status: 'Pending'
//     }
//   ];
//     }

//   fetchArtworksByArtist(id: string): void {
//       this.http.get<any[]>(`http://localhost:5000/api/artworks/${id}`).subscribe({
//         next: (response) => {
//           this.artworks = response;
//           this.loading = false;
//         },
//         error: (error) => {
//           this.errorMessage = 'Failed to load artworks';
//           this.loading = false;
//         }
//       });
//   // constructor(private router: Router) {}

//   addartwork(): void {
//     this.router.navigate(['/addartwork']);
//   }

//   editArtwork(artworkId: number): void {
//     this.router.navigate(['/editartwork', artworkId]);
//   }

//   deleteArtwork(artworkId: number): void {
//     if (confirm('Are you sure you want to delete this artwork?')) {
//       this.artworks = this.artworks.filter(artwork => artwork.id !== artworkId);
//     }
//   }

//   viewOrderDetails(orderId: string): void {
//     this.router.navigate(['/orders', orderId]);
//   }

//   logout(): void {
//     if (confirm('Are you sure you want to logout?')) {
//       localStorage.removeItem('authToken');
//       this.router.navigate(['/login']);
//     }
//   }
// }
// }
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-artist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {

  artist_id: string = '';
  artwork_id:string='';
  artworks: any[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  recentOrders = [
    {
      id: 'ORD-001',
      artwork: 'Abstract Harmony',
      customer: 'John Smith',
      quantity: 1,
      status: 'Delivered'
    },
    {
      id: 'ORD-002',
      artwork: 'Mountain Serenity',
      customer: 'Sarah Johnson',
      quantity: 1,
      status: 'Pending'
    },
    {
      id: 'ORD-003',
      artwork: 'Urban Dreams',
      customer: 'Mike Davis',
      quantity: 2,
      status: 'Delivered'
    },
    {
      id: 'ORD-004',
      artwork: 'Ocean Waves',
      customer: 'Emily Brown',
      quantity: 1,
      status: 'Pending'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // 
    console.log(localStorage.getItem('user_id') )
    this.artist_id = localStorage.getItem('user_id') || '';
    this.fetchArtworksByArtist(this.artist_id);
    console.log('🧑‍🎨 artistId:', this.artist_id);
  }
  
  fetchArtworksByArtist(id: string): void {
    this.http.get<any[]>(`http://localhost:5000/api/artworks/artist/${id}`).subscribe({
      next: (response) => {
        this.artworks = response;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load artworks.';
        console.error(error);
        console.log(error)
        this.loading = false;
      }
    });
  }

  

  
  editArtwork(artworkId: number): void {
    this.router.navigate(['/editartwork', artworkId]);
  } 
  
  deleteArtwork(artwork_id:string): void {
    if (!confirm('Are you sure you want to delete this artwork? This action cannot be undone.')) {
      return; 
    }

  else{
    const token = localStorage.getItem('access_token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
  
    this.http.delete<any>(`http://localhost:5000/api/artworks/${artwork_id}`, { headers }).subscribe({
      next: () => {
        alert('Artwork deleted successfully!');
        this.artworks = this.artworks.filter(a => a.artwork_id !== artwork_id);
        // this.router.navigate(['/artistdashboard']);
      },
      error: (err) => {
        this.errorMessage = 'Failed to delete artwork';
        console.error(err);
      }
    });
  }
}
  get artworksCount(): number {
    return this.artworks.length;
  }
}
