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
  imageFile: File | null = null;
  editImageFile: File | null = null;

  // Pagination
  page: number = 1;

  // Search
  searchTerm: string = '';
  onSearchChange(term: string) {
    this.searchTerm = term;
  }

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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        title: 'Error!',
        text: 'Please select a valid image file.',
        icon: 'error'
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: 'Error!',
        text: 'Image file must be smaller than 5MB.',
        icon: 'error'
      });
      return;
    }

    // Store file for later upload
    this.imageFile = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  onEditFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        title: 'Error!',
        text: 'Please select a valid image file.',
        icon: 'error'
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: 'Error!',
        text: 'Image file must be smaller than 5MB.',
        icon: 'error'
      });
      return;
    }

    // Store file for later upload
    this.editImageFile = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.editImagePreview = e.target?.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  create() {
    this.errors = {};

    // Build FormData with all employee properties and file
    const formData = new FormData();
    formData.append('FirstName', this.employee.firstName || '');
    formData.append('LastName', this.employee.lastName || '');
    formData.append('Title', this.employee.title || '');

    // Append image file if selected
    if (this.imageFile) {
      formData.append('ImageFile', this.imageFile);
    }

    this.service.create(formData).subscribe({
      next: () => {
        Swal.fire({
          title: "Eklendi!",
          text: "Personel başarıyla eklendi.",
          icon: "success"
        });
        this.getAll();
        this.employee = new Employee();
        this.imagePreview = null;
        this.imageFile = null;
      },
      error: err => {
        this.errors = err.error.errors;
        console.log(this.errors);
        this.cdr.detectChanges();
      }
    })
  }

  update() {
    // Build FormData with all employee properties and file
    const formData = new FormData();
    formData.append('FirstName', this.editEmployee.firstName || '');
    formData.append('LastName', this.editEmployee.lastName || '');
    formData.append('Title', this.editEmployee.title || '');

    // Append image file only if new one is selected
    if (this.editImageFile) {
      formData.append('ImageFile', this.editImageFile);
    }

    this.service.update(this.editEmployee.id, formData).subscribe({
      next: () => {
        this.getAll();
        this.editImagePreview = null;
        this.editImageFile = null;

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
    this.editImageFile = null;
  }

  /**
   * Get full image URL by prepending server address
   */
  getImageUrl(path: string | null | undefined): string {
    if (!path) return 'assets/img/team/team-1.jpg';

    // If path already starts with http or is a data URL, return as is
    if (path.startsWith('http') || path.startsWith('data:')) {
      return path;
    }

    // Prepend server URL to relative path
    return `https://localhost:7000${path}`;
  }

  /**
   * Handle image load errors
   */
  onImageError(event: any): void {
    console.error('Image failed to load:', event.target.src);
    event.target.src = 'assets/img/team/team-1.jpg';
  }
}

