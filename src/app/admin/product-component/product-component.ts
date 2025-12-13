import Swal from 'sweetalert2';
import { Product } from '../../_models/product-model';
import { ProductService } from '../../_services/product-service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ProductCategory } from '../../_models/product-category-model';
import { ProductCategoryService } from '../../_services/product-category-service';
import { ImageService } from '../../_services/image-service';

@Component({
  selector: 'app-product-component',
  standalone: false,
  templateUrl: './product-component.html',
  styleUrl: './product-component.css',
})
export class ProductComponent {
  product: Product = new Product();
  productList: Product[] = [];
  categoryList: ProductCategory[] = [];
  editProduct: Product = new Product(); // Düzenlenen ürünü tutar
  errors: any = {}; // Validation hatalarını tutar

  // Image handling
  imagePreview: string | null = null;
  editImagePreview: string | null = null;

  // Pagination
  page: number = 1;

  constructor(
    private productService: ProductService,
    private categoryService: ProductCategoryService,
    private imageService: ImageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getAllProducts();
    this.getAllCategories();
  }

  onFileSelected(event: any) {
    const imageObservable = this.imageService.handleFileSelection(event, 2);

    if (imageObservable) {
      imageObservable.subscribe({
        next: (result) => {
          this.imagePreview = result.preview;
          this.product.imagePath = result.base64;
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
          this.editProduct.imagePath = result.base64;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Görsel yükleme hatası:', err);
        }
      });
    }
  }

  getAllProducts() {
    this.productService.getWithDetails().subscribe({
      next: values => {
        this.productList = values;
        this.cdr.detectChanges();
      },
      error: err => console.error('Error loading products:', err)
    })
  }

  getAllCategories() {
    this.categoryService.getAll().subscribe({
      next: values => this.categoryList = values,
      error: err => console.error('Error loading categories:', err)
    })
  }

  getProductById(id: number) {
    this.productService.getById(id).subscribe({
      next: value => this.product = value,
      error: err => console.error('Error loading product by id:', err)
    })
  }

  createProduct() {
    console.log('Form submitted, product:', this.product);
    this.errors = {};

    this.productService.create(this.product).subscribe({
      next: () => {
        Swal.fire({
          title: "Eklendi!",
          text: "Ürün başarıyla eklendi.",
          icon: "success"
        });
        this.getAllProducts();
        this.product = new Product();
        this.imagePreview = null;
      },
      error: err => {
        this.errors = err.error.errors;
        console.log(this.errors);
        this.cdr.detectChanges();
      }
    })
  }

  updateProduct() {
    this.productService.update(this.editProduct.id, this.editProduct).subscribe({
      next: () => {
        this.getAllProducts();
        this.editImagePreview = null;

        Swal.fire({
          title: "Güncellendi!",
          text: "Ürün başarıyla güncellendi.",
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

  onSelected(model: Product) {
    // Object'in kopyasını oluştur (referans değil)
    this.editProduct = { ...model };
    this.editImagePreview = null;
  }

  deleteProduct(id: number) {
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
        this.productService.delete(id).subscribe({
          next: () => {
            // Listeyi yenile
            this.getAllProducts();

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



}
