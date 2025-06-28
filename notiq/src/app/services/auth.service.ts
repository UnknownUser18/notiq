import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn : 'root'
})
export class AuthService {

  constructor(private http : HttpClient) {
  }

  public login(username : string, password : string) {
    console.log('Logging in with username:', username);
    return this.http.post('/api/auth/login', { username, password }, { withCredentials : true });
  }
}
