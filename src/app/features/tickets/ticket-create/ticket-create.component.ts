import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TicketService } from '../../../core/services/ticket.service';
import { TicketPriority, TicketStatus } from '../../../core/models/ticket.interface';

@Component({
  selector: 'app-ticket-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.scss']
})
export class TicketCreateComponent {
  private fb = inject(FormBuilder);
  private ticketService = inject(TicketService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  ticketForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(20)]],
    category: ['', Validators.required],
    priority: [TicketPriority.MEDIUM, Validators.required],
    attachments: [[]]
  });

  selectedFiles: File[] = [];
  maxFileSize = 5 * 1024 * 1024; // 5MB
  allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];

  priorities = Object.values(TicketPriority);
  categories = [
    'Technical Support',
    'Account Access',
    'Billing',
    'Feature Request',
    'Bug Report',
    'General Inquiry'
  ];

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      const validFiles = files.filter(file => this.validateFile(file));
      
      if (validFiles.length !== files.length) {
        this.snackBar.open(
          'Some files were rejected. Please check file size (max 5MB) and type.',
          'Close',
          { duration: 5000 }
        );
      }

      this.selectedFiles = [...this.selectedFiles, ...validFiles];
      this.ticketForm.patchValue({ attachments: this.selectedFiles });
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.ticketForm.patchValue({ attachments: this.selectedFiles });
  }

  private validateFile(file: File): boolean {
    return file.size <= this.maxFileSize && this.allowedFileTypes.includes(file.type);
  }

  private async uploadFiles(): Promise<string[]> {
    // This is a placeholder. In a real application, you would upload files to your server
    // and return the URLs of the uploaded files.
    return this.selectedFiles.map(file => URL.createObjectURL(file));
  }

  onSubmit(): void {
    if (this.ticketForm.valid) {
      this.uploadFiles().then(fileUrls => {
        const ticketData = {
          ...this.ticketForm.value,
          attachments: fileUrls,
          status: TicketStatus.OPEN,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        this.ticketService.createTicket(ticketData).subscribe({
          next: (ticket) => {
            this.snackBar.open('Ticket created successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
            this.router.navigate(['/tickets', ticket.id]);
          },
          error: (error) => {
            this.snackBar.open(
              error?.error?.message || 'Failed to create ticket. Please try again.',
              'Close',
              { duration: 5000 }
            );
          }
        });
      });
    } else {
      this.markFormGroupTouched(this.ticketForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  trackByFn(index: number, item: any): any {
    return item;
  }
}
