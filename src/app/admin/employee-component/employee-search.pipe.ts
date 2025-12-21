import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'employeeSearch',
  standalone: true
})
export class EmployeeSearchPipe implements PipeTransform {
  transform(employees: any[], searchTerm: string): any[] {
    if (!employees || !searchTerm) return employees;
    const term = searchTerm.toLowerCase();
    return employees.filter(emp =>
      (emp.firstName && emp.firstName.toLowerCase().includes(term)) ||
      (emp.lastName && emp.lastName.toLowerCase().includes(term)) ||
      (emp.title && emp.title.toLowerCase().includes(term))
    );
  }
}
