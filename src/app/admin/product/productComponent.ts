import Swal from 'sweetalert2';
import { Product } from '../../_models/product';
import { ProductService } from './../../_services/product-service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { CategoryService } from '../../_services/categoryService';
import { Category } from '../../_models/category';

@Component({
  selector: 'app-productComponent',
  standalone: false,
  templateUrl: './productComponent.html',
  styleUrl: './productComponent.css',
})
export class ProductComponent {
  product: Product = new Product();
  productList: Product[] = [];
  categoryList: Category[] = [];
  editProduct: any = {}; // Düzenlenen ürünü tutar
  originalProduct: any = {}; // Orjinal değeri sakla
  errors: any = {}; // Validation hatalarını tutar

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) { }

  //In order to load products when component is initialized
  ngOnInit() {
    console.log('ProductComponent ngOnInit called');
    this.getAllProducts();
    this.getAllCategories();
  }

  getAllProducts() {
    console.log('getAllProducts method called');
    this.productService.getAll().subscribe({
      next: values => {
        console.log('Products received:', values);
        this.productList = [...values]; // Create a new array reference
        this.cdr.detectChanges(); // Manual change detection
        console.log('productList updated:', this.productList);
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

  createProduct(form?: any) {
    // Önceki hataları temizle (yeni bir ekleme denemesi için temiz başla)
    this.errors = {};

    // Ürün ekleme isteğini backend'e gönder
    this.productService.create(this.product).subscribe({
      // Başarılı olursa (201 Created response gelirse)
      next: value => {
        // Yeni eklenen ürünü listeye ekle
        this.productList.push(value);

        // Eğer form parametresi geldiyse (HTML'den gönderiliyor), formu temizle
        if (form) {
          form.resetForm();
        }

        // Product objesini yeni bir instance ile değiştir
        this.product = new Product();

        // Angular'ın değişiklikleri algılaması için manuel tetikleme
        this.cdr.detectChanges();

        // Modal'ı programatik olarak kapat (Bootstrap API kullanarak)
        const modalElement = document.getElementById('createModal');
        const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }

        // Kullanıcıya başarı mesajı göster
        Swal.fire({
          title: "Eklendi!",
          text: "Ürün başarıyla eklendi.",
          icon: "success"
        });
      },
      // Hata olursa (400 Bad Request gibi)
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
            this.getAllProducts();
            Swal.fire({
              title: "Silindi!",
              text: "Ürün başarıyla silindi.",
              icon: "success",
              confirmButtonColor: "#28a745"
            });
          },
          error: err => console.log(err)
        });
      }

      else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "İptal Edildi",
          text: "Silme işlemi iptal edildi.",
          icon: "error",
          confirmButtonColor: "#dc3545"
        });
      }
    });
  }



}
