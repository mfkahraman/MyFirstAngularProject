import { WriterService } from './../../_services/writer-service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Blog } from '../../_models/blog-model';
import { BlogCategory } from '../../_models/blog-category-model';
import { Writer } from '../../_models/writer-model';
import { Tag } from '../../_models/tag-model';
import { BlogService } from '../../_services/blog-service';
import { BlogCategoryService } from '../../_services/blog-category-service';
import { TagService } from '../../_services/tag-service';
import { ImageService } from '../../_services/image-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blog-component',
  standalone: false,
  templateUrl: './blog-component.html',
  styleUrl: './blog-component.css',
})
export class BlogComponent implements OnInit {
  blog: Blog = new Blog();
  blogList: Blog[] = [];
  editBlog: Blog = new Blog();
  categoryList: BlogCategory[] = [];
  writerList: Writer[] = [];
  tagList: Tag[] = [];
  errors: any = {};

  // Image handling
  imagePreview: string | null = null;
  editImagePreview: string | null = null;

  // Pagination
  page: number = 1;

  constructor(
    private blogService: BlogService,
    private categoryService: BlogCategoryService,
    private writerService: WriterService,
    private tagService: TagService,
    private imageService: ImageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getAllBlogs();
    this.getAllCategories();
    this.getAllWriters();
    this.getAllTags();
  }

  onFileSelected(event: any) {
    const imageObservable = this.imageService.handleFileSelection(event, 2);

    if (imageObservable) {
      imageObservable.subscribe({
        next: (result) => {
          this.imagePreview = result.preview;
          this.blog.contentImageUrl = result.base64;
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
          this.editBlog.contentImageUrl = result.base64;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Görsel yükleme hatası:', err);
        }
      });
    }
  }

  getAllBlogs() {
    this.blogService.getWithDetails().subscribe({
      next: values => {
        this.blogList = values;
        this.cdr.detectChanges();
      },
      error: err => console.error('Error loading blogs:', err)
    })
  }

  getAllCategories() {
    this.categoryService.getAll().subscribe({
      next: values => this.categoryList = values,
      error: err => console.error('Error loading categories:', err)
    })
  }

  getAllWriters() {
    this.writerService.getAll().subscribe({
      next: values => this.writerList = values,
      error: err => console.error('Error loading writers:', err)
    })
  }

  getAllTags() {
    this.tagService.getAll().subscribe({
      next: values => this.tagList = values,
      error: err => console.error('Error loading tags:', err)
    })
  }

  getBlogById(id: number) {
    this.blogService.getById(id).subscribe({
      next: value => this.blog = value,
      error: err => console.error('Error loading blog by id:', err)
    })
  }

  createBlog() {
    console.log('Form submitted, blog:', this.blog);
    this.errors = {};

    this.blogService.create(this.blog).subscribe({
      next: () => {
        Swal.fire({
          title: "Eklendi!",
          text: "Ürün başarıyla eklendi.",
          icon: "success"
        });
        this.getAllBlogs();
        this.blog = new Blog();
        this.imagePreview = null;
      },
      error: err => {
        this.errors = err.error.errors;
        console.log(this.errors);
        this.cdr.detectChanges();
      }
    })
  }

  updateBlog() {
    this.blogService.update(this.editBlog.id, this.editBlog).subscribe({
      next: () => {
        this.getAllBlogs();
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

  onSelected(model: Blog) {
    // Object'in kopyasını oluştur (referans değil)
    this.editBlog = { ...model };
    this.editImagePreview = null;
  }

  deleteBlog(id: number) {
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
        this.blogService.delete(id).subscribe({
          next: () => {
            // Listeyi yenile
            this.getAllBlogs();

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
