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
  editImagePreview: string | null = null;

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
    const imageObservable = this.imageService.handleFileSelection(event, 2);

    if (imageObservable) {
      imageObservable
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result) => {
            this.imagePreview = result.preview;
            this.product.imagePath = result.base64;
            this.cdr.detectChanges();
          },
          error: (err) => this.handleError('Image upload error', err)
        });
    }
  }

  /**
   * Handle file selection for editing product image
   */
  onEditFileSelected(event: Event): void {
    const imageObservable = this.imageService.handleFileSelection(event, 2);

    if (imageObservable) {
      imageObservable
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result) => {
            this.editImagePreview = result.preview;
            this.editProduct.imagePath = result.base64;
            this.cdr.detectChanges();
          },
          error: (err) => this.handleError('Image upload error', err)
        });
    }
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
    this.editImagePreview = null;
  }

  /**
   * Reset product creation form
   */
  private resetProductForm(): void {
    this.product = new Product();
    this.imagePreview = null;
  }

  /**
   * Reset product edit form
   */
  private resetEditProductForm(): void {
    this.editImagePreview = null;
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
}
