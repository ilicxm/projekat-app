import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  register(name: string, email: string, password: string) {
    // Update the URL to point to your backend server (running on port 3000)
    return this.http.post<any>('http://localhost:8100/register', { name, email, password });
  }
}