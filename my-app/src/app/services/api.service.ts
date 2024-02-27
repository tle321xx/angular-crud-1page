import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private baseUrl: string = 'http://localhost:3000/posts'

  constructor(private http: HttpClient) {}

  postUser(data: User) {
    return this.http.post(`${this.baseUrl}`, data);
  }

  getUser() {
    return this.http.get<User[]>(`${this.baseUrl}`);
  }

  putUser(data: User, id: number) {
    return this.http.put<User>(`${this.baseUrl}/${id}`, data);
  }

  deleteUser(id: number) {
    return this.http.delete<User>(`${this.baseUrl}/${id}`);
  }

  getUserId(id:number){
    return this.http.get(`${this.baseUrl}/${id}`)
  }
}
