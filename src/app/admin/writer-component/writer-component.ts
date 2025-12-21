import { WriterService } from './../../_services/writer-service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Writer } from '../../_models/writer-model';
import Swal from 'sweetalert2';
import { ImageService } from '../../_services/image-service';

@Component({
  selector: 'app-writer-component',
  standalone: false,
  templateUrl: './writer-component.html',
  styleUrl: './writer-component.css',
})
export class WriterComponent implements OnInit {
  writerList: Writer[] = [];
  writer: Writer = new Writer();
  editWriter: Writer = new Writer();
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
    private writerService: WriterService,
    private imageService: ImageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.writerService.getAll().subscribe({
      next: (values) => {
        this.writerList = values;
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

    // Build FormData with all writer properties and file
    const formData = new FormData();
    formData.append('FullName', this.writer.fullName || '');
    formData.append('Bio', this.writer.bio || '');

    // Append image file if selected
    if (this.imageFile) {
      formData.append('ImageFile', this.imageFile);
    }

    this.writerService.create(formData).subscribe({
      next: () => {
        Swal.fire({
          title: "Eklendi!",
          text: "Kategori başarıyla eklendi.",
          icon: "success"
        });
        this.getAll();
        this.writer = new Writer();
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
    // Build FormData with all writer properties and file
    const formData = new FormData();
    formData.append('FullName', this.editWriter.fullName || '');
    formData.append('Bio', this.editWriter.bio || '');

    // Append image file only if new one is selected
    if (this.editImageFile) {
      formData.append('ImageFile', this.editImageFile);
    }

    this.writerService.update(this.editWriter.id, formData).subscribe({
      next: () => {
        this.getAll();
        this.editImagePreview = null;
        this.editImageFile = null;

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
        this.writerService.delete(id).subscribe({
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

  onSelected(model: Writer) {
    this.editWriter = { ...model };
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
