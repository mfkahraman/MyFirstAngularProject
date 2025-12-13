import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BlogCategory } from '../../_models/blog-category-model';
import { BlogCategoryService } from '../../_services/blog-category-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blog-category-component',
  standalone: false,
  templateUrl: './blog-category-component.html',
  styleUrl: './blog-category-component.css',
})
export class BlogCategoryComponent implements OnInit {
  blogCategoryList: BlogCategory[] = [];
  blogCategory: BlogCategory = new BlogCategory();
  editBlogCategory: BlogCategory = new BlogCategory();
  errors: any = {}; // Validation hatalarını tutar

  constructor(
    private blogCategoryService: BlogCategoryService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.blogCategoryService.getAll().subscribe({
      next: (values) => {
        this.blogCategoryList = values;
        this.cdr.detectChanges();
      },
      error: err => console.error('Error loading blog categories:', err)
    })
  }

  create() {
    this.errors = {};

    this.blogCategoryService.create(this.blogCategory).subscribe({
      next: () => {
        Swal.fire({
          title: "Eklendi!",
          text: "Kategori başarıyla eklendi.",
          icon: "success"
        });
        this.getAll();
        this.blogCategory = new BlogCategory();
      },
      error: err => {
        this.errors = err.error.errors;
        console.log(this.errors);
        this.cdr.detectChanges();
      }
    })
  }

  update() {
    this.blogCategoryService.update(this.editBlogCategory.id, this.editBlogCategory).subscribe({
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
        this.blogCategoryService.delete(id).subscribe({
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

  onSelected(model: BlogCategory) {
    this.editBlogCategory = { ...model };
  }
}
