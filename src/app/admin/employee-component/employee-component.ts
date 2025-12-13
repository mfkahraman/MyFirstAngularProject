import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Employee } from '../../_models/employee-model';
import { EmployeeService } from '../../_services/employee-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-component',
  standalone: false,
  templateUrl: './employee-component.html',
  styleUrl: './employee-component.css',
})
export class EmployeeComponent implements OnInit {
  employeeList: Employee[] = [];
  employee: Employee = new Employee();
  editEmployee: Employee = new Employee();
  errors: any = {};

  // Pagination
  page: number = 1;

  constructor(
    private service: EmployeeService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.service.getAll().subscribe({
      next: (values) => {
        this.employeeList = values;
        this.cdr.detectChanges();
      },
      error: err => console.error('Error loading data:', err)
    })
  }

  create() {
    this.errors = {};

    this.service.create(this.employee).subscribe({
      next: () => {
        Swal.fire({
          title: "Eklendi!",
          text: "Kategori başarıyla eklendi.",
          icon: "success"
        });
        this.getAll();
        this.employee = new Employee();
      },
      error: err => {
        this.errors = err.error.errors;
        console.log(this.errors);
        this.cdr.detectChanges();
      }
    })
  }

  update() {
    this.service.update(this.editEmployee.id, this.editEmployee).subscribe({
      next: () => {
        this.getAll();

        Swal.fire({
          title: "Güncellendi!",
          text: "Kategori başarıyla güncellendi.",
          icon: "success"
        });
      },
      error: err => {
        this.errors = err.error.errors;
        console.log(this.errors);
        this.cdr.detectChanges();
      }
    })
  }

  delete(id: number) {
    Swal.fire({
      title: "Emin misiniz?",
      text: "Bu işlemi geri alamayacaksınız!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Evet, sil!",
      cancelButtonText: "Hayır, iptal et!",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#dc3545",
      reverseButtons: true,
      buttonsStyling: true,
      customClass: {
        confirmButton: "swal-confirm-btn",
        cancelButton: "swal-cancel-btn"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(id).subscribe({
          next: () => {
            // Listeyi yenile
            this.getAll();

            Swal.fire({
              title: "Silindi!",
              text: "Dosyanız silindi.",
              icon: "success",
              confirmButtonColor: "#28a745"
            });
          },
          error: err => {
            console.error('Silme hatası:', err);
            Swal.fire({
              title: "Hata!",
              text: "Silme sırasında bir hata oluştu.",
              icon: "error"
            });
          }
        });
      }
    });
  }

  onSelected(model: Employee) {
    this.editEmployee = { ...model };
  }
}

