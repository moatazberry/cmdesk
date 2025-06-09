import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Customer } from '../models/customer.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly STORAGE_KEY = 'customers';
  private customers: Customer[] = [];
  private authService = inject(AuthService);

  constructor() {
    this.loadCustomers();
  }

  private loadCustomers(): void {
    const storedCustomers = localStorage.getItem(this.STORAGE_KEY);
    if (storedCustomers) {
      try {
        this.customers = JSON.parse(storedCustomers).map((customer: any) => ({
          ...customer,
          created_at: new Date(customer.created_at),
          updated_at: new Date(customer.updated_at)
        }));
      } catch {
        this.customers = [];
      }
    }
  }

  private saveCustomers(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.customers));
  }

  getCustomers(): Observable<Customer[]> {
    return of(this.customers);
  }

  getCustomer(id: string): Observable<Customer> {
    const customer = this.customers.find(c => c.id === id);
    return customer ? of(customer) : throwError(() => new Error('Customer not found'));
  }

  createCustomer(customerData: Partial<Customer>): Observable<Customer> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return throwError(() => new Error('User not authenticated'));
    }

    const newCustomer: Customer = {
      id: crypto.randomUUID(),
      name: customerData.name!,
      email: customerData.email!,
      phone: customerData.phone,
      company: customerData.company,
      address: customerData.address,
      created_at: new Date(),
      updated_at: new Date()
    };

    this.customers.push(newCustomer);
    this.saveCustomers();
    return of(newCustomer);
  }

  updateCustomer(id: string, customerData: Partial<Customer>): Observable<Customer> {
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) {
      return throwError(() => new Error('Customer not found'));
    }

    const updatedCustomer: Customer = {
      ...this.customers[index],
      ...customerData,
      updated_at: new Date()
    };

    this.customers[index] = updatedCustomer;
    this.saveCustomers();
    return of(updatedCustomer);
  }

  deleteCustomer(id: string): Observable<void> {
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) {
      return throwError(() => new Error('Customer not found'));
    }

    this.customers.splice(index, 1);
    this.saveCustomers();
    return of(void 0);
  }

  searchCustomers(query: string): Observable<Customer[]> {
    const normalizedQuery = query.toLowerCase();
    const results = this.customers.filter(customer => 
      customer.name.toLowerCase().includes(normalizedQuery) ||
      customer.email.toLowerCase().includes(normalizedQuery) ||
      customer.company?.toLowerCase().includes(normalizedQuery)
    );
    return of(results);
  }
}
