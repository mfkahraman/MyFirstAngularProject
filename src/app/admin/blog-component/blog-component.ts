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
import { BlogTagService } from '../../_services/blog-tag-service';
import { BlogTag } from '../../_models/blog-tag-model';

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
  selectedTags: number[] = [];
  editSelectedTags: number[] = [];
  errors: any = {};

  // Image handling
  coverImagePreview: string | null = null;
  contentImagePreview: string | null = null;
  editCoverImagePreview: string | null = null;
  editContentImagePreview: string | null = null;

  // Pagination
  page: number = 1;

  constructor(
    private blogService: BlogService,
    private categoryService: BlogCategoryService,
    private writerService: WriterService,
    private tagService: TagService,
    private blogTagService: BlogTagService,
    private imageService: ImageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getAllBlogs();
    this.getAllCategories();
    this.getAllWriters();
    this.getAllTags();
  }

  onCoverFileSelected(event: any) {
    const imageObservable = this.imageService.handleFileSelection(event, 2);

    if (imageObservable) {
      imageObservable.subscribe({
        next: (result) => {
          this.coverImagePreview = result.preview;
          this.blog.coverImageUrl = result.base64;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Cover image upload error:', err);
        }
      });
    }
  }

  onContentFileSelected(event: any) {
    const imageObservable = this.imageService.handleFileSelection(event, 2);

    if (imageObservable) {
      imageObservable.subscribe({
        next: (result) => {
          this.contentImagePreview = result.preview;
          this.blog.contentImageUrl = result.base64;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Content image upload error:', err);
        }
      });
    }
  }

  onEditCoverFileSelected(event: any) {
    const imageObservable = this.imageService.handleFileSelection(event, 2);

    if (imageObservable) {
      imageObservable.subscribe({
        next: (result) => {
          this.editCoverImagePreview = result.preview;
          this.editBlog.coverImageUrl = result.base64;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Cover image upload error:', err);
        }
      });
    }
  }

  onEditContentFileSelected(event: any) {
    const imageObservable = this.imageService.handleFileSelection(event, 2);

    if (imageObservable) {
      imageObservable.subscribe({
        next: (result) => {
          this.editContentImagePreview = result.preview;
          this.editBlog.contentImageUrl = result.base64;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Content image upload error:', err);
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

  toggleTag(tagId: number) {
    const index = this.selectedTags.indexOf(tagId);
    if (index > -1) {
      this.selectedTags.splice(index, 1);
    } else {
      this.selectedTags.push(tagId);
    }
  }

  isTagSelected(tagId: number): boolean {
    return this.selectedTags.includes(tagId);
  }

  toggleEditTag(tagId: number) {
    const index = this.editSelectedTags.indexOf(tagId);
    if (index > -1) {
      this.editSelectedTags.splice(index, 1);
    } else {
      this.editSelectedTags.push(tagId);
    }
  }

  isEditTagSelected(tagId: number): boolean {
    return this.editSelectedTags.includes(tagId);
  }

  createBlog() {
    console.log('Form submitted, blog:', this.blog);
    console.log('Selected tags:', this.selectedTags);
    this.errors = {};

    // Blog objesine tagIds'i ekle
    this.blog.tagIds = this.selectedTags;

    this.blogService.create(this.blog).subscribe({
      next: () => {
        Swal.fire({
          title: "Success!",
          text: "Blog successfully created!",
          icon: "success"
        });
        this.getAllBlogs();
        this.blog = new Blog();
        this.selectedTags = [];
        this.coverImagePreview = null;
        this.contentImagePreview = null;
      },
      error: err => {
        this.errors = err.error.errors;
        console.log(this.errors);
        this.cdr.detectChanges();
      }
    })
  }

  updateBlog() {
    console.log('Update blog:', this.editBlog);
    console.log('Selected tags for edit:', this.editSelectedTags);

    // Blog objesine tagIds'i ekle
    this.editBlog.tagIds = this.editSelectedTags;

    this.blogService.update(this.editBlog.id, this.editBlog).subscribe({
      next: () => {
        this.getAllBlogs();
        this.editCoverImagePreview = null;
        this.editContentImagePreview = null;
        this.editSelectedTags = [];

        Swal.fire({
          title: "Updated!",
          text: "Blog successfully updated.",
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
    this.editCoverImagePreview = null;
    this.editContentImagePreview = null;

    // Blog'un mevcut taglarını yükle (sadece isDeleted = false olanlar)
    this.editSelectedTags = model.blogTags
      ? model.blogTags
          .filter(bt => !bt.isDeleted)
          .map(bt => bt.tagId)
      : [];
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
