import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Category } from '../../_models/category';
import { CategoryService } from '../../_services/categoryService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categoryComponent',
  standalone: false,
  templateUrl: './categoryComponent.html',
  styleUrl: './categoryComponent.css',
})
export class CategoryComponent implements OnInit {
  categoryList: Category[] = [];
  category: Category = new Category();
  editCategory: any = {};
  originalCategory: any = {}; // Orjinal değeri sakla

  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('CategoryComponent ngOnInit called');
    this.getAll();
  }

  getAll() {
    console.log('getAll method called');
    this.categoryService.getAll().subscribe({
      next: values => {
        console.log('Categories received:', values);
        this.categoryList = [...values]; // Yeni array referansı oluştur
        this.cdr.detectChanges(); // Manuel değişiklik algılama
        console.log('categoryList updated:', this.categoryList);
      },
      error: err => console.error('Error loading categories:', err)
    })
  }

  create() {
    this.categoryService.create(this.category).subscribe({
      next: value => {
        Swal.fire({
          title: "Eklendi!",
          text: "Kategori başarıyla eklendi.",
          icon: "success"
        });
        this.getAll();
        this.category = new Category();
      },
      error: err => console.log(err)
    })
  }

  update() {
    this.categoryService.update(this.editCategory.id, this.editCategory).subscribe({
      next: () => {
        this.getAll();
        Swal.fire({
          title: "Güncellendi!",
          text: "Kategori başarıyla güncellendi.",
          icon: "success"
        });
      },
      error: err => console.log(err)
    })
  }

  onSelected(model: Category) {
    // Object'in kopyasını oluştur (referans değil)
    this.editCategory = { ...model };
    this.originalCategory = { ...model }; // Orjinal değeri de sakla
  }

  // Kategori değişti mi kontrol et
  isCategoryChanged(): boolean {
    return this.editCategory.categoryName !== this.originalCategory.categoryName;
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
        this.categoryService.delete(id).subscribe({
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
