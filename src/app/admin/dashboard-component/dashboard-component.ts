import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BlogService } from '../../_services/blog-service';
import { ProductService } from '../../_services/product-service';
import { EmployeeService } from '../../_services/employee-service';
import { MessageService } from '../../_services/message-service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-component',
  standalone: false,
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent implements OnInit {
  statistics = {
    totalProducts: 0,
    totalBlogs: 0,
    totalEmployees: 0,
    totalMessages: 0,
    unreadMessages: 0
  };

  recentBlogs: any[] = [];
  recentMessages: any[] = [];
  isLoading: boolean = true;

  constructor(
    private blogService: BlogService,
    private productService: ProductService,
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Dashboard component initialized');
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    console.log('Starting to load dashboard data...');

    // Load all data in parallel with error handling
    forkJoin({
      products: this.productService.getAll().pipe(
        catchError(err => {
          console.error('Error loading products:', err);
          return of([]);
        })
      ),
      blogs: this.blogService.getWithDetails().pipe(
        catchError(err => {
          console.error('Error loading blogs:', err);
          return of([]);
        })
      ),
      employees: this.employeeService.getAll().pipe(
        catchError(err => {
          console.error('Error loading employees:', err);
          return of([]);
        })
      ),
      messages: this.messageService.getAll().pipe(
        catchError(err => {
          console.error('Error loading messages:', err);
          return of([]);
        })
      )
    }).subscribe({
      next: (data) => {
        console.log('Dashboard data loaded:', data);

        // Update statistics
        this.statistics.totalProducts = data.products.length;
        this.statistics.totalBlogs = data.blogs.length;
        this.statistics.totalEmployees = data.employees.length;
        this.statistics.totalMessages = data.messages.length;
        this.statistics.unreadMessages = data.messages.filter((m: any) => !m.isRead).length;

        // Get recent items
        this.recentBlogs = data.blogs.slice(0, 5);
        this.recentMessages = data.messages.slice(0, 5);

        this.isLoading = false;
        console.log('Dashboard loading complete, isLoading:', this.isLoading);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Critical error loading dashboard data:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getStatusBadgeClass(status: boolean): string {
    return status ? 'badge bg-success' : 'badge bg-warning';
  }

  getStatusText(status: boolean): string {
    return status ? 'Read' : 'Unread';
  }
}
