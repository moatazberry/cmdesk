import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TicketService } from '../../../core/services/ticket.service';
import { Ticket, TicketStatus, TicketPriority } from '../../../core/models/ticket.interface';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit {
  private ticketService = inject(TicketService);

  displayedColumns: string[] = ['id', 'title', 'status', 'priority', 'createdAt', 'assignedTo', 'actions'];
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  
  // Filter properties
  searchTerm: string = '';
  selectedStatus: TicketStatus | '' = '';
  selectedPriority: TicketPriority | '' = '';
  selectedAssignee: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  
  // For pagination
  pageSize = 10;
  currentPage = 0;
  totalTickets = 0;

  // Status and Priority options
  statusOptions = Object.values(TicketStatus);
  priorityOptions = Object.values(TicketPriority);
  assigneeOptions: string[] = [];

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.ticketService.getTickets().subscribe(tickets => {
      this.tickets = tickets;
      // Get unique assignees for the filter dropdown
      this.assigneeOptions = Array.from(new Set(tickets
        .map(t => t.assignedTo)
        .filter(assignee => assignee) as string[]));
      this.applyFilter();
    });
  }

  applyFilter(): void {
    let filtered = this.tickets;
    
    // Text search
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchLower) ||
        ticket.description.toLowerCase().includes(searchLower) ||
        ticket.id.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (this.selectedStatus) {
      filtered = filtered.filter(ticket => ticket.status === this.selectedStatus);
    }

    // Priority filter
    if (this.selectedPriority) {
      filtered = filtered.filter(ticket => ticket.priority === this.selectedPriority);
    }

    // Assignee filter
    if (this.selectedAssignee) {
      filtered = filtered.filter(ticket => ticket.assignedTo === this.selectedAssignee);
    }

    // Date range filter
    if (this.startDate) {
      filtered = filtered.filter(ticket => 
        new Date(ticket.createdAt) >= this.startDate!
      );
    }
    if (this.endDate) {
      filtered = filtered.filter(ticket => 
        new Date(ticket.createdAt) <= this.endDate!
      );
    }

    this.totalTickets = filtered.length;
    this.filteredTickets = filtered.slice(
      this.currentPage * this.pageSize,
      (this.currentPage + 1) * this.pageSize
    );
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedPriority = '';
    this.selectedAssignee = '';
    this.startDate = null;
    this.endDate = null;
    this.applyFilter();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilter();
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
