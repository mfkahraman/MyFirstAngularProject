import Swal from 'sweetalert2';
import { Product } from '../../_models/product';
import { ProductService } from './../../_services/product-service';
import { ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-productComponent',
  standalone: false,
  templateUrl: './productComponent.html',
  styleUrl: './productComponent.css',
})
export class ProductComponent {
  product: Product = new Product();
  productList: Product[] = [];
  editProduct: any = {};

  constructor(
    private productService: ProductService
    , private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    console.log('ProductComponent ngOnInit called');
    this.getAllProducts();
  }

  getAllProducts() {
    console.log('getAllProducts method called');
    this.productService.getAll().subscribe({
      next: values => {
        console.log('Products received:', values);
        this.productList = [...values]; // Yeni array referansı oluştur
        this.cdr.detectChanges(); // Manuel değişiklik algılama
        console.log('productList updated:', this.productList);
      },
      error: err => console.error('Error loading products:', err)    })
  }

  getProductById(id: number) {
    this.productService.getById(id).subscribe({
      next: value => this.product = value,
      error: err => console.log(err)
    })
  }

  createProduct() {
    this.productService.create(this.product).subscribe({
      next: value => {
        Swal.fire({
          title: "Eklendi!",
          text: "Ürün başarıyla eklendi.",
          icon: "success"
        });
        this.getAllProducts();
        this.product = new Product();
      },
      error: err => console.log(err)
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
      error: err => console.log(err)
    })
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
