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
  blogCategory: BlogCategory = new BlogCategory()
  editBlogCategory: any = {};
  originalBlogCategory: any = {};

  constructor(
    private blogCategoryService: BlogCategoryService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.blogCategoryService.getAll().subscribe({
      next: values => {
        this.blogCategoryList = values;
        this.cdr.detectChanges();
      },
      error: err => console.error('Error loading blog categories:', err)
    })
  }

  create() {
    this.blogCategoryService.create(this.blogCategory).subscribe({
      next: value => {
        Swal.fire({
          title: "Eklendi!",
          text: "Kategori başarıyla eklendi.",
          icon: "success"
        });
        this.getAll();
        this.blogCategory = new BlogCategory();
      },
      error: err => console.log(err)
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
      error: err => console.log(err)
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

  onSelected(model: BlogCategory) {
    this.editBlogCategory = { ...model };
    this.originalBlogCategory = { ...model };
  }


  isCategoryChanged(): boolean {
    return this.editBlogCategory.categoryName !== this.originalBlogCategory.categoryName;
  }


}
