import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../../core/services/customer.service';

@Component({
  selector: 'app-customer-create',
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Create New Customer</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="customerForm" (ngSubmit)="onSubmit()">
            <mat-form-field>
              <mat-label>Name</mat-label>
              <input matInput formControlName="name">
              <mat-error *ngIf="customerForm.get('name')?.hasError('required')">
                Name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Email</mat-label>
              <input matInput formControlName="email">
              <mat-error *ngIf="customerForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="customerForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Phone</mat-label>
              <input matInput formControlName="phone">
            </mat-form-field>

            <mat-form-field>
              <mat-label>Company</mat-label>
              <input matInput formControlName="company">
            </mat-form-field>

            <mat-form-field>
              <mat-label>Address</mat-label>
              <textarea matInput formControlName="address"></textarea>
            </mat-form-field>

            <div class="actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="!customerForm.valid">
                Create
              </button>
              <button mat-raised-button type="button" (click)="goBack()">
                Cancel
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .actions {
      display: flex;
      gap: 16px;
      margin-top: 16px;
    }
  `]
})
export class CustomerCreateComponent {
  customerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router
  ) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      company: [''],
      address: ['']
    });
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      this.customerService.createCustomer(this.customerForm.value)
        .subscribe(() => {
          this.router.navigate(['/customers']);
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/customers']);
  }
}
