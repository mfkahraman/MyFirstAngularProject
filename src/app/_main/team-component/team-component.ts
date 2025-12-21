import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Employee } from '../../_models/employee-model';
import { EmployeeService } from '../../_services/employee-service';

@Component({
  selector: 'app-team',
  standalone: false,
  templateUrl: './team-component.html',
  styleUrl: './team-component.css',
})
export class TeamComponent implements OnInit {
  employeeList: Employee[] = [];
  readonly serverUrl = 'https://localhost:7000';

  constructor(
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadTeamMembers();
  }

  loadTeamMembers() {
    this.employeeService.getAll().subscribe({
      next: (employees) => {
        this.employeeList = employees.map(emp => ({
          ...emp,
          imageUrl: this.getImageUrl(emp.imageUrl)
        }));
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error loading team members:', error),
    });
  }

  getImageUrl(path: string | null | undefined): string {
    if (!path) return 'assets/img/portfolio/companyservices.png';
    if (path.startsWith('http') || path.startsWith('data:')) {
      return path;
    }
    return `${this.serverUrl}${path}`;
  }
}
