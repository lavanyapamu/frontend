

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/users'; // Update as needed

  constructor(private http: HttpClient) {}


  getUser(user_id: string): Observable<any> 
  {
    return this.http.get(`${this.apiUrl}/${user_id}`);
  }

  // update_user(user_id: string, formData: FormData): Observable<any>
  // {
  //   return this.http.patch(`${this.apiUrl}/${user_id}`, formData);
  // }

  update_user(user_id: string, formData: FormData): Observable<any> {
    const token = localStorage.getItem('access_token');
  
    if (!token) {
      throw new Error("User is not authenticated");
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.patch(`${this.apiUrl}/${user_id}`, formData, { headers });
  }
  
  
}
