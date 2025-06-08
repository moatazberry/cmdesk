import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Ticket, TicketStatus, TicketComment } from '../models/ticket.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly STORAGE_KEY = 'tickets';
  private tickets: Ticket[] = [];
  private authService = inject(AuthService);

  constructor() {
    this.loadTickets();
  }

  private loadTickets(): void {
    const storedTickets = localStorage.getItem(this.STORAGE_KEY);
    if (storedTickets) {
      try {
        this.tickets = JSON.parse(storedTickets).map((ticket: any) => ({
          ...ticket,
          createdAt: new Date(ticket.createdAt),
          updatedAt: new Date(ticket.updatedAt)
        }));
      } catch {
        this.tickets = [];
      }
    }
  }

  private saveTickets(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tickets));
  }

  getTickets(): Observable<Ticket[]> {
    return of(this.tickets);
  }

  getTicketById(id: string): Observable<Ticket> {
    const ticket = this.tickets.find(t => t.id === id);
    return ticket ? of(ticket) : throwError(() => new Error('Ticket not found'));
  }

  createTicket(ticketData: Partial<Ticket>): Observable<Ticket> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return throwError(() => new Error('User not authenticated'));
    }

    const ticket: Ticket = {
      id: Date.now().toString(),
      title: ticketData.title || '',
      description: ticketData.description || '',
      category: ticketData.category || '',
      priority: ticketData.priority!,
      status: TicketStatus.OPEN,
      createdBy: user.id,
      assignedTo: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
      attachments: ticketData.attachments || []
    };

    this.tickets.push(ticket);
    this.saveTickets();
    return of(ticket);
  }

  updateTicket(id: string, ticketData: Partial<Ticket>): Observable<Ticket> {
    const index = this.tickets.findIndex(t => t.id === id);
    
    if (index === -1) {
      return throwError(() => new Error('Ticket not found'));
    }

    const updatedTicket: Ticket = {
      ...this.tickets[index],
      ...ticketData,
      updatedAt: new Date()
    };

    this.tickets[index] = updatedTicket;
    this.saveTickets();
    return of(updatedTicket);
  }

  deleteTicket(id: string): Observable<void> {
    this.tickets = this.tickets.filter(t => t.id !== id);
    this.saveTickets();
    return of(void 0);
  }

  addComment(ticketId: string, content: string): Observable<Ticket> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return throwError(() => new Error('User not authenticated'));
    }

    const ticketIndex = this.tickets.findIndex(t => t.id === ticketId);
    if (ticketIndex === -1) {
      return throwError(() => new Error('Ticket not found'));
    }

    const comment: TicketComment = {
      id: Date.now().toString(),
      content,
      createdBy: user.id,
      createdAt: new Date()
    };

    const updatedTicket = {
      ...this.tickets[ticketIndex],
      comments: [...(this.tickets[ticketIndex].comments || []), comment],
      updatedAt: new Date()
    };

    this.tickets[ticketIndex] = updatedTicket;
    this.saveTickets();
    return of(updatedTicket);
  }

  updateStatus(ticketId: string, status: TicketStatus): Observable<Ticket> {
    return this.updateTicket(ticketId, { status });
  }

  assignTicket(ticketId: string, userId: string): Observable<Ticket> {
    return this.updateTicket(ticketId, { assignedTo: userId });
  }

  uploadFile(file: File): Observable<{ url: string }> {
    // For demo purposes, we'll just create an object URL
    const url = URL.createObjectURL(file);
    return of({ url });
  }
}
