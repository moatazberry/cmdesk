import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Customer } from '../../../core/models/customer.interface';
import { CustomerService } from '../../../core/services/customer.service';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isEditing ? 'Edit' : 'View' }} Customer</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="customerForm" (ngSubmit)="onSubmit()">
            <mat-form-field>
              <mat-label>Name</mat-label>
              <input matInput formControlName="name" [readonly]="!isEditing">
              <mat-error *ngIf="customerForm.get('name')?.hasError('required')">
                Name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" [readonly]="!isEditing">
              <mat-error *ngIf="customerForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="customerForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Phone</mat-label>
              <input matInput formControlName="phone" [readonly]="!isEditing">
            </mat-form-field>

            <mat-form-field>
              <mat-label>Company</mat-label>
              <input matInput formControlName="company" [readonly]="!isEditing">
            </mat-form-field>

            <mat-form-field>
              <mat-label>Address</mat-label>
              <textarea matInput formControlName="address" [readonly]="!isEditing"></textarea>
            </mat-form-field>

            <div class="actions">
              <button *ngIf="!isEditing" mat-raised-button color="primary" type="button" (click)="toggleEdit()">
                Edit
              </button>
              <button *ngIf="isEditing" mat-raised-button color="primary" type="submit" [disabled]="!customerForm.valid">
                Save
              </button>
              <button mat-raised-button type="button" (click)="goBack()">
                Back
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
export class CustomerDetailComponent implements OnInit {  customerForm: FormGroup;
  isEditing = false;
  customerId?: string;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute,
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
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.customerId = idParam;
      this.loadCustomer();
    }
  }

  loadCustomer(): void {
    this.customerService.getCustomer(this.customerId!).subscribe(customer => {
      this.customerForm.patchValue(customer);
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  onSubmit(): void {
    if (this.customerForm.valid && this.customerId) {
      this.customerService.updateCustomer(this.customerId, this.customerForm.value)
        .subscribe(() => {
          this.isEditing = false;
          this.loadCustomer();
        });
    }
  }

  goBack(): void {
    this.router.navigate(['/customers']);
  }
}
