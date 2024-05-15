import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  updateProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateProfile`, profileData);
  }

  checkUserByEmail(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/checkUserByEmail`, { email });
  }

  getProfileDetails(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/checkUserByEmail`, { email });
  }
}

