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
        this.employeeList = employees;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error loading team members:', error),
    });
  }
}
