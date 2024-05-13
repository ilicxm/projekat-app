// profilepage.services.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = 'http://localhost:3000'; // Server URL, adjust as needed

  constructor(private http: HttpClient) { }

  // Function to save profile data to the database
  saveProfile(profileData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/profiles`, profileData);
  }

  // Function to update or create profile data in the database
  updateProfile(profileData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/updateProfile`, profileData);
  }

  // Function to check if user with given email exists in the database
  checkUserByEmail(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/checkUserByEmail`, { email });
  }

  // Function to create profile data in the database
  createProfile(profileData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/createProfile`, profileData);
  }
}
