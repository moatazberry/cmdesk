import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, UserRole } from '../models/user.interface';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private jwtHelper = new JwtHelperService();

  // Test users for the application
  private readonly testUsers = [
    {
      id: '1',
      email: 'admin@cmdesk.com',
      password: 'Admin123!',
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      department: 'IT'
    },
    {
      id: '2',
      email: 'agent@cmdesk.com',
      password: 'Agent123!',
      firstName: 'Support',
      lastName: 'Agent',
      role: UserRole.AGENT,
      department: 'Support'
    },
    {
      id: '3',
      email: 'user@cmdesk.com',
      password: 'User123!',
      firstName: 'Regular',
      lastName: 'User',
      role: UserRole.USER,
      department: 'Marketing'
    }
  ];

  constructor(private http: HttpClient) {
    this.checkToken();
  }

  login(email: string, password: string): Observable<{ token: string; user: User }> {
    // Find the test user
    const user = this.testUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Create a simple token (in production this should be a proper JWT)
      const userWithDates = { 
        ...user, 
        password: undefined, 
        createdAt: new Date(), 
        updatedAt: new Date() 
      };
      const token = btoa(JSON.stringify({
        ...userWithDates,
        createdAt: userWithDates.createdAt.toISOString(),
        updatedAt: userWithDates.updatedAt.toISOString()
      }));
      const response = { token, user: userWithDates };
      
      localStorage.setItem('token', response.token);
      this.currentUserSubject.next(response.user);
      
      return of(response);
    }
    
    return throwError(() => new Error('Invalid credentials'));
  }

  register(userData: Partial<User>): Observable<{ token: string; user: User }> {
    // For demo purposes, just simulate a successful registration
    const now = new Date();
    const newUser = {
      id: (this.testUsers.length + 1).toString(),
      email: userData.email!,
      firstName: userData.firstName!,
      lastName: userData.lastName!,
      role: UserRole.USER,
      department: userData.department || 'General',
      createdAt: now,
      updatedAt: now
    };

    const token = btoa(JSON.stringify({
      ...newUser,
      createdAt: newUser.createdAt.toISOString(),
      updatedAt: newUser.updatedAt.toISOString()
    }));
    const response = { token, user: newUser };
    
    localStorage.setItem('token', response.token);
    this.currentUserSubject.next(response.user);
    
    return of(response);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    try {
      // Optionally, you can add more checks here (e.g., token expiration)
      JSON.parse(atob(token));
      return true;
    } catch {
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const user = JSON.parse(atob(token));
      return {
        ...user,
        createdAt: user.createdAt ? new Date(user.createdAt) : undefined,
        updatedAt: user.updatedAt ? new Date(user.updatedAt) : undefined
      };
    } catch {
      return null;
    }
  }

  private checkToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const user = JSON.parse(atob(token));
        // Convert string dates back to Date objects if present
        if (user.createdAt) user.createdAt = new Date(user.createdAt);
        if (user.updatedAt) user.updatedAt = new Date(user.updatedAt);
        this.currentUserSubject.next(user);
      } catch {
        this.logout();
      }
    }
  }
}
