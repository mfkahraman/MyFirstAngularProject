import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { Product } from '../../_models/product-model';
import { ProductCategory } from '../../_models/product-category-model';
import { ProductService } from '../../_services/product-service';
import { ProductCategoryService } from '../../_services/product-category-service';
import { ImageService } from '../../_services/image-service';

@Component({
  selector: 'app-product-component',
  standalone: false,
  templateUrl: './product-component.html',
  styleUrl: './product-component.css',
})
export class ProductComponent implements OnInit, OnDestroy {
  // Product data
  productList: Product[] = [];
  filteredProductList: Product[] = [];
  categoryList: ProductCategory[] = [];

  // Form models
  product: Product = new Product();
  editProduct: Product = new Product();

  // Search and filter
  searchText: string = '';
  selectedCategoryId: number | null = null;

  // Image handling
  imagePreview: string | null = null;
  thumbnailPreview: string | null = null;
  editImagePreview: string | null = null;
  editThumbnailPreview: string | null = null;

  // Pagination
  page: number = 1;
  itemsPerPage: number = 4;

  // Validation errors
  errors: any = {};

  // Unsubscribe subject for memory management
  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private categoryService: ProductCategoryService,
    private imageService: ImageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load initial data (products and categories)
   */
  private loadInitialData(): void {
    this.getAllProducts();
    this.getAllCategories();
  }

  /**
   * Fetch all products from the server
   */
  getAllProducts(): void {
    this.productService.getWithDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          this.productList = products;
          this.filteredProductList = products;
          this.cdr.detectChanges();
        },
        error: (err) => this.handleError('Error loading products', err)
      });
  }

  /**
   * Fetch all categories from the server
   */
  getAllCategories(): void {
    this.categoryService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => this.categoryList = categories,
        error: (err) => this.handleError('Error loading categories', err)
      });
  }

  /**
   * Filter products based on search text and selected category
   */
  filterProducts(): void {
    let filtered = this.productList;

    // Filter by search text
    if (this.searchText.trim()) {
      const searchLower = this.searchText.toLowerCase();
      filtered = filtered.filter(product =>
        product.productName.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.category?.categoryName.toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (this.selectedCategoryId) {
      filtered = filtered.filter(product => product.categoryId === this.selectedCategoryId);
    }

    this.filteredProductList = filtered;
    this.page = 1; // Reset to first page when filtering
  }

  /**
   * Handle file selection for product image upload
   */
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

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);

    // Upload to server
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'product');

    this.productService.uploadImage(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.product.imagePath = response.filePath;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.handleError('Image upload error', err);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to upload image to server.',
            icon: 'error'
          });
        }
      });
  }

  /**
   * Handle file selection for product thumbnail upload
   */
  onThumbnailSelected(event: Event): void {
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

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.thumbnailPreview = e.target?.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);

    // Upload to server
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'product');

    this.productService.uploadImage(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.product.thumbnailImagePath = response.filePath;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.handleError('Thumbnail upload error', err);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to upload thumbnail to server.',
            icon: 'error'
          });
        }
      });
  }

  /**
   * Handle file selection for editing product image
   */
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

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.editImagePreview = e.target?.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);

    // Upload to server
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'product');

    this.productService.uploadImage(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.editProduct.imagePath = response.filePath;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.handleError('Image upload error', err);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to upload image to server.',
            icon: 'error'
          });
        }
      });
  }

  /**
   * Handle file selection for editing product thumbnail
   */
  onEditThumbnailSelected(event: Event): void {
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

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.editThumbnailPreview = e.target?.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);

    // Upload to server
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'product');

    this.productService.uploadImage(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.editProduct.thumbnailImagePath = response.filePath;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.handleError('Thumbnail upload error', err);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to upload thumbnail to server.',
            icon: 'error'
          });
        }
      });
  }

  /**
   * Create a new product
   */
  createProduct(): void {
    this.errors = {};

    this.productService.create(this.product)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showSuccessAlert('Success!', 'Product has been added successfully.');
          this.resetProductForm();
          this.getAllProducts();
        },
        error: (err) => {
          this.errors = err.error?.errors || {};
          console.error('Create product error:', this.errors);
          this.cdr.detectChanges();
        }
      });
  }

  /**
   * Update an existing product
   */
  updateProduct(): void {
    this.errors = {};

    this.productService.update(this.editProduct.id, this.editProduct)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showSuccessAlert('Updated!', 'Product has been updated successfully.');
          this.resetEditProductForm();
          this.getAllProducts();
        },
        error: (err) => {
          this.errors = err.error?.errors || {};
          console.error('Update product error:', this.errors);
          this.cdr.detectChanges();
        }
      });
  }

  /**
   * Delete a product with confirmation
   */
  deleteProduct(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      reverseButtons: true,
      buttonsStyling: true,
      customClass: {
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.performDelete(id);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.showInfoAlert('Cancelled', 'Delete operation has been cancelled.');
      }
    });
  }

  /**
   * Perform the actual delete operation
   */
  private performDelete(id: number): void {
    this.productService.delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.getAllProducts();
          this.showSuccessAlert('Deleted!', 'Product has been deleted successfully.');
        },
        error: (err) => {
          console.error('Delete error:', err);
          Swal.fire({
            title: 'Error!',
            text: 'An error occurred during deletion.',
            icon: 'error',
            confirmButtonColor: '#dc3545'
          });
        }
      });
  }

  /**
   * Select a product for editing
   */
  onSelected(product: Product): void {
    // Create a deep copy to avoid reference issues
    this.editProduct = { ...product };

    // Convert date to YYYY-MM-DD format for HTML date input
    if (this.editProduct.projectDate) {
      const date = new Date(this.editProduct.projectDate);
      (this.editProduct.projectDate as any) = date.toISOString().split('T')[0];
    }

    this.editImagePreview = null;
    this.editThumbnailPreview = null;
  }

  /**
   * Reset product creation form
   */
  private resetProductForm(): void {
    this.product = new Product();
    this.imagePreview = null;
    this.thumbnailPreview = null;
  }

  /**
   * Reset product edit form
   */
  private resetEditProductForm(): void {
    this.editImagePreview = null;
    this.editThumbnailPreview = null;
  }

  /**
   * Show success alert
   */
  private showSuccessAlert(title: string, text: string): void {
    Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonColor: '#0d6efd'
    });
  }

  /**
   * Show info alert
   */
  private showInfoAlert(title: string, text: string): void {
    Swal.fire({
      title,
      text,
      icon: 'info',
      confirmButtonColor: '#6c757d'
    });
  }

  /**
   * Handle and log errors
   */
  private handleError(message: string, error: any): void {
    console.error(message, error);
  }

  /**
   * Handle image load errors
   */
  onImageError(event: any): void {
    console.error('Image failed to load:', event.target.src);
    event.target.src = 'assets/img/portfolio/companyservices.png'; // Set fallback image on error
  }
}
