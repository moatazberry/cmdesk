import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Customer } from '../../../core/models/customer.interface';
import { CustomerService } from '../../../core/services/customer.service';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Customers</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="actions">
            <button mat-raised-button color="primary" (click)="createCustomer()">
              <mat-icon>add</mat-icon> New Customer
            </button>
          </div>
          
          <mat-form-field>
            <mat-label>Filter</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Search customers..." #input>
          </mat-form-field>

          <div class="mat-elevation-z8">
            <table mat-table [dataSource]="dataSource" matSort>
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header> Name </th>
                <td mat-cell *matCellDef="let row"> {{row.name}} </td>
              </ng-container>

              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef mat-sort-header> Email </th>
                <td mat-cell *matCellDef="let row"> {{row.email}} </td>
              </ng-container>

              <ng-container matColumnDef="phone">
                <th mat-header-cell *matHeaderCellDef mat-sort-header> Phone </th>
                <td mat-cell *matCellDef="let row"> {{row.phone}} </td>
              </ng-container>

              <ng-container matColumnDef="company">
                <th mat-header-cell *matHeaderCellDef mat-sort-header> Company </th>
                <td mat-cell *matCellDef="let row"> {{row.company}} </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef> Actions </th>
                <td mat-cell *matCellDef="let row">
                  <button mat-icon-button color="primary" (click)="viewCustomer(row.id)">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteCustomer(row.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page of customers"></mat-paginator>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    .actions {
      margin-bottom: 20px;
    }
    mat-form-field {
      width: 100%;
      margin-bottom: 20px;
    }
    table {
      width: 100%;
    }
    .mat-column-actions {
      width: 100px;
      text-align: center;
    }
  `]
})
export class CustomerListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'email', 'phone', 'company', 'actions'];
  dataSource: MatTableDataSource<Customer> = new MatTableDataSource();
  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCustomers(): void {
    this.customerService.getCustomers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(customers => {
        this.dataSource = new MatTableDataSource(customers);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  createCustomer(): void {
    this.router.navigate(['/customers/create']);
  }

  viewCustomer(id: string): void {
    this.router.navigate(['/customers', id]);
  }

  editCustomer(id: string): void {
    this.router.navigate(['/customers', id, 'edit']);
  }

  deleteCustomer(id: string): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.loadCustomers();
        });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
