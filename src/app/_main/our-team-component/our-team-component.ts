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
        this.employeeList = employees;
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
}
