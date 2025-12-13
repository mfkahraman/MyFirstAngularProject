import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductCategory } from '../../_models/product-category-model';
import Swal from 'sweetalert2';
import { ProductCategoryService } from '../../_services/product-category-service';

@Component({
  selector: 'app-product-category-component',
  standalone: false,
  templateUrl: './product-category-component.html',
  styleUrl: './product-category-component.css',
})
export class ProductCategoryComponent implements OnInit {
  categoryList: ProductCategory[] = [];
  category: ProductCategory = new ProductCategory();
  editCategory: ProductCategory = new ProductCategory();
  errors: any = {}; // Validation hatalarını tutar

  constructor(
    private productCategoryService: ProductCategoryService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.productCategoryService.getAll().subscribe({
      next: values => {
        this.categoryList = values;
        this.cdr.detectChanges(); // Manuel değişiklik algılamayı tetikle
      },
      error: err => console.error('Error loading categories:', err)
    })
  }

  create() {
    this.errors = {};

    this.productCategoryService.create(this.category).subscribe({
      next: () => {
        Swal.fire({
          title: "Eklendi!",
          text: "Kategori başarıyla eklendi.",
          icon: "success"
        });
        this.getAll();
        this.category = new ProductCategory();
      },
      error: err => {
        this.errors = err.error.errors;
        console.log(this.errors);
        this.cdr.detectChanges();
      }
    })
  }

  update() {
    this.productCategoryService.update(this.editCategory.id, this.editCategory).subscribe({
      next: () => {
        this.getAll();

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

  onSelected(model: ProductCategory) {
    // Object'in kopyasını oluştur (referans değil)
    this.editCategory = { ...model };
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
        this.productCategoryService.delete(id).subscribe({
          next: () => {
            this.getAll();
            Swal.fire({
              title: "Silindi!",
              text: "Dosyanız silindi.",
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
