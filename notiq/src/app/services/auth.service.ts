import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn : 'root'
})
export class AuthService {

  constructor(private http : HttpClient) {
  }

  public login(username : string, password : string, rememberMe : boolean = false) {
    return this.http.post('/api/auth/login', { username, password, rememberMe }, { withCredentials : true, observe : 'response' });
  }

  public rejectLogin() {
    return this.http.post('/api/auth/reject-login', {}, { withCredentials : true, observe : 'response' });
  }
  public checkLoginStatus() {
    return this.http.post('/api/auth/check-login-status', {}, { withCredentials : true, observe : 'response' });
  }
}
