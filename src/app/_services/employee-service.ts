import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../_models/employee-model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  apiUrl = 'https://localhost:7000/api/Employees/'

  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get<Employee[]>(this.apiUrl)
  }

  getById(id: number) {
    return this.httpClient.get<Employee>(this.apiUrl + id)
  }

  create(employee: Employee) {
    return this.httpClient.post<Employee>(this.apiUrl, employee)
  }

  update(id: number, employee: Employee) {
    return this.httpClient.put(this.apiUrl + id, employee, { responseType: 'text' })
  }

  delete(id: number) {
    return this.httpClient.delete(this.apiUrl + id, { responseType: 'text' })
  }

}
