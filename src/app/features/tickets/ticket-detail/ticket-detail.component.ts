import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TicketService } from '../../../core/services/ticket.service';
import { AuthService } from '../../../core/services/auth.service';
import { Ticket, TicketStatus, TicketPriority } from '../../../core/models/ticket.interface';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss']
})
export class TicketDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ticketService = inject(TicketService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  ticket?: Ticket;
  commentForm: FormGroup;
  ticketStatuses = Object.values(TicketStatus);
  ticketPriorities = Object.values(TicketPriority);

  constructor() {
    this.commentForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const ticketId = this.route.snapshot.paramMap.get('id');
    if (ticketId) {
      this.loadTicket(ticketId);
    }
  }

  loadTicket(id: string): void {
    this.ticketService.getTicketById(id).subscribe({
      next: (ticket) => {
        this.ticket = ticket;
      },
      error: () => {
        this.snackBar.open('Error loading ticket', 'Close', { duration: 3000 });
        this.router.navigate(['/tickets']);
      }
    });
  }

  updateStatus(status: TicketStatus): void {
    if (this.ticket) {
      this.ticketService.updateStatus(this.ticket.id, status).subscribe({
        next: (updatedTicket) => {
          this.ticket = updatedTicket;
          this.snackBar.open('Status updated successfully', 'Close', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('Error updating status', 'Close', { duration: 3000 });
        }
      });
    }
  }

  addComment(): void {
    if (this.commentForm.valid && this.ticket) {
      const content = this.commentForm.get('content')?.value;
      this.ticketService.addComment(this.ticket.id, content).subscribe({
        next: (updatedTicket) => {
          this.ticket = updatedTicket;
          this.commentForm.reset();
          this.snackBar.open('Comment added successfully', 'Close', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('Error adding comment', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getPriorityColor(priority: TicketPriority): string {
    switch (priority) {
      case TicketPriority.LOW: return 'green';
      case TicketPriority.MEDIUM: return 'orange';
      case TicketPriority.HIGH: return 'red';
      case TicketPriority.URGENT: return 'purple';
      default: return 'gray';
    }
  }

  getStatusColor(status: TicketStatus): string {
    switch (status) {
      case TicketStatus.OPEN: return 'blue';
      case TicketStatus.IN_PROGRESS: return 'orange';
      case TicketStatus.ON_HOLD: return 'gray';
      case TicketStatus.RESOLVED: return 'green';
      case TicketStatus.CLOSED: return 'black';
      default: return 'gray';
    }
  }
}
