import Swal from 'sweetalert2';
import { Product } from '../../_models/product-model';
import { ProductService } from '../../_services/product-service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ProductCategory } from '../../_models/product-category-model';
import { ProductCategoryService } from '../../_services/product-category-service';

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

  constructor(
    private productService: ProductService,
    private categoryService: ProductCategoryService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getAllProducts();
    this.getAllCategories();
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
    // Önceki hataları temizle (yeni bir ekleme denemesi için temiz başla)
    this.errors = {};

    this.productService.create(this.product).subscribe({
      next: () => {
        this.product = new Product();
        this.getAllProducts();

        Swal.fire({
          title: "Eklendi!",
          text: "Ürün başarıyla eklendi.",
          icon: "success"
        });
      },
      error: err => {
        // Backend'den gelen validation hatalarını errors objesine ata
        // Örnek: {ProductName: ["Ürün adı en az 3 karakter olmalıdır."]}
        this.errors = err.error.errors;

        // Angular'ın değişiklikleri algılaması için manuel tetikleme
        // Böylece hata mesajları UI'da görünür
        this.cdr.detectChanges();
      }
    })
  }

  updateProduct() {
    this.productService.update(this.editProduct.id, this.editProduct).subscribe({
      next: () => {
        this.getAllProducts();

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
