import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Employee } from '../../_models/employee-model';
import { EmployeeService } from '../../_services/employee-service';

@Component({
  selector: 'app-our-team-component',
  standalone: false,
  templateUrl: './our-team-component.html',
  styleUrl: './our-team-component.css',
})
export class OurTeamComponent implements OnInit {
  employeeList: Employee[] = [];
  isLoading: boolean = true;
  readonly serverUrl = 'https://localhost:7000';

  constructor(
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadTeamMembers();
  }

  loadTeamMembers() {
    this.isLoading = true;
    this.employeeService.getAll().subscribe({
      next: (employees) => {
        this.employeeList = employees.map(emp => ({
          ...emp,
          imageUrl: this.getImageUrl(emp.imageUrl)
        }));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading team members:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  getImageUrl(path: string | null | undefined): string {
    if (!path) return 'https://ui-avatars.com/api/?name=Team+Member&size=400&background=random';
    if (path.startsWith('http') || path.startsWith('data:')) {
      return path;
    }
    return `${this.serverUrl}${path}`;
  }
  onImageError(employee: any) {
    employee.imageUrl = 'https://ui-avatars.com/api/?name=' + encodeURIComponent((employee.firstName || '') + ' ' + (employee.lastName || '')) + '&size=400&background=random';
  }
}
