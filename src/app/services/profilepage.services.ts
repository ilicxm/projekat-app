import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  saveProfile(profileData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/profiles`, profileData);
  }

  updateProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/profiles/${profileData.email}`, profileData);
  }

  checkUserByEmail(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/checkUserByEmail`, { email });
  }


  createProfile(profileData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/profiles`, profileData);
  }

  getUserProfile(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/getUserProfile`, { email });
  }

}

