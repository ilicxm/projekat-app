import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  register(name: string, email: string, password: string) {
    return this.http.post<any>('http://localhost:8100/register', { name, email, password });
  }
}
