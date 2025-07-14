import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn : 'root'
})
export class AuthService {

  constructor(private http : HttpClient) {
  }

  /**
   * @method login
   * @description Sends a login request to the server with the provided username, password, and rememberMe flag.
   * @param username - The username of the user trying to log in.
   * @param password - The password of the user trying to log in.
   * @param rememberMe - A boolean indicating whether the user wants to be remembered (e.g., stay logged in).
   */
  public login(username : string, password : string, rememberMe : boolean = false) {
    return this.http.post('/api/auth/login', { username, password, rememberMe }, { withCredentials : true, observe : 'response' });
  }

  /**
   * @method rejectLogin
   * @description Sends a request to ban the user from logging in for a certain period of time.
   * @return An Observable that emits the HTTP response.
   * @remarks This method is typically called after a certain number of failed login attempts.
   */
  public rejectLogin() {
    return this.http.post('/api/auth/reject-login', {}, { withCredentials : true, observe : 'response' });
  }

  /**
   * @method checkLoginStatus
   * @description Checks if the user is allowed to log in.
   * @return An Observable that emits the HTTP response.
   */
  public checkLoginStatus() {
    return this.http.post('/api/auth/check-login-status', {}, { withCredentials : true, observe : 'response' });
  }

  /**
   * @method checkSession
   * @description Checks if the user has an active session.
   * @return An Observable that emits the HTTP response.
   * @remarks This method is used to verify if the user is still logged in and has a valid session.
   */
  public checkSession() {
    return this.http.post('/api/auth/check-session', {}, { withCredentials : true, observe : 'response' });
  }
}
