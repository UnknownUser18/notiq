import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { provideHttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service : AuthService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers : [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', () => {
    const mockData = { success : true };

    service.login('testuser', 'blabla', true).subscribe(response => {
      expect(response.body).toEqual(mockData);
      expect(response.status).toBe(200);
    });

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockData, { status : 200, statusText : 'OK' });

    httpMock.verify();
  })

  it('should reject login', () => {
    const mockData = { success : false };

    service.login('testuser', 'blabla', true).subscribe({
      next : () => {
        fail('Expected an error, but got success response');
      },

      error(err) {
        expect(err.error).toEqual(mockData);
        expect(err.status).toBe(401);
      }
    });

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockData, { status : 401, statusText : 'Unauthorized' });

    httpMock.verify();
  })

});
