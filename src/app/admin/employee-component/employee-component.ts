import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Employee } from '../../_models/employee-model';
import { EmployeeService } from '../../_services/employee-service';
import { ImageService } from '../../_services/image-service';
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

  // Image handling
  imagePreview: string | null = null;
  editImagePreview: string | null = null;

  // Pagination
  page: number = 1;

  constructor(
    private service: EmployeeService,
    private imageService: ImageService,
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

  onFileSelected(event: any) {
    const imageObservable = this.imageService.handleFileSelection(event, 2);

    if (imageObservable) {
      imageObservable.subscribe({
        next: (result) => {
          this.imagePreview = result.preview;
          this.employee.imageUrl = result.base64;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Görsel yükleme hatası:', err);
        }
      });
    }
  }

  onEditFileSelected(event: any) {
    const imageObservable = this.imageService.handleFileSelection(event, 2);

    if (imageObservable) {
      imageObservable.subscribe({
        next: (result) => {
          this.editImagePreview = result.preview;
          this.editEmployee.imageUrl = result.base64;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Görsel yükleme hatası:', err);
        }
      });
    }
  }

  create() {
    this.errors = {};

    this.service.create(this.employee).subscribe({
      next: () => {
        Swal.fire({
          title: "Eklendi!",
          text: "Personel başarıyla eklendi.",
          icon: "success"
        });
        this.getAll();
        this.employee = new Employee();
        this.imagePreview = null;
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
        this.editImagePreview = null;

        Swal.fire({
          title: "Güncellendi!",
          text: "Personel başarıyla güncellendi.",
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
    this.editImagePreview = null;
  }
}

