import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Testimonial } from '../../_models/testimonial-model';
import { TestimonialService } from '../../_services/testimonial-service';
import Swal from 'sweetalert2';
import { ImageService } from '../../_services/image-service';

@Component({
  selector: 'app-testimonial-component',
  standalone: false,
  templateUrl: './testimonial-component.html',
  //styleUrl: './testimonial-component.css',
})
export class TestimonialComponent implements OnInit {
  testimonialList: Testimonial[] = [];
  testimonial: Testimonial = new Testimonial();
  editTestimonial: Testimonial = new Testimonial();
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
    private testimonialService: TestimonialService,
    private imageService: ImageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.testimonialService.getAll().subscribe({
      next: (values) => {
        this.testimonialList = values;
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
    formData.append('ClientName', this.testimonial.clientName || '');
    formData.append('Title', this.testimonial.title || '');
    formData.append('Comment', this.testimonial.comment || '');

    // Append image file if selected
    if (this.imageFile) {
      formData.append('ImageFile', this.imageFile);
    }

    this.testimonialService.create(formData).subscribe({
      next: () => {
        Swal.fire({
          title: "Succesfully Added!",
          text: "Testimonial has been added successfully.",
          icon: "success"
        });
        this.getAll();
        this.testimonial = new Testimonial();
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
    formData.append('ClientName', this.editTestimonial.clientName || '');
    formData.append('Title', this.editTestimonial.title || '');
    formData.append('Comment', this.editTestimonial.comment || '');

    // Append image file only if new one is selected
    if (this.editImageFile) {
      formData.append('ImageFile', this.editImageFile);
    }

    this.testimonialService.update(this.editTestimonial.id, formData).subscribe({
      next: () => {
        this.getAll();
        this.editImagePreview = null;
        this.editImageFile = null;

        Swal.fire({
          title: "Successfully Updated!",
          text: "Testimonial has been updated successfully.",
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
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
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
        this.testimonialService.delete(id).subscribe({
          next: () => {
            // Listeyi yenile
            this.getAll();

            Swal.fire({
              title: "Deleted!",
              text: "Your testimonial has been deleted.",
              icon: "success",
              confirmButtonColor: "#28a745"
            });
          },
          error: err => {
            console.error('Delete error:', err);
            Swal.fire({
              title: "Error!",
              text: "An error occurred during deletion.",
              icon: "error"
            });
          }
        });
      }
    });
  }

  onSelected(model: Testimonial) {
    this.editTestimonial = { ...model };
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
