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
  isLoading: boolean = false;

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
    this.isLoading = true;
    this.blogService.getWithDetails().subscribe({
      next: values => {
        this.blogList = values;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Error loading blogs:', err);
        this.isLoading = false;
      }
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
    this.errors = {};

    // Convert selectedTags to blogTags format
    this.blog.blogTags = this.selectedTags.map(tagId => ({
      id: 0,
      blogId: 0,
      tagId: tagId,
      isDeleted: false
    }));

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
        this.cdr.detectChanges();
      }
    })
  }

  updateBlog() {
    // Convert editSelectedTags to blogTags format
    this.editBlog.blogTags = this.editSelectedTags.map(tagId => ({
      id: 0,
      blogId: this.editBlog.id,
      tagId: tagId,
      isDeleted: false
    }));

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
        this.cdr.detectChanges();
      }
    })
  }

  onSelected(model: Blog) {
    // Create a copy of the object (not a reference)
    this.editBlog = { ...model };
    this.editCoverImagePreview = null;
    this.editContentImagePreview = null;

    // Load blog's current tags (only non-deleted ones)
    this.editSelectedTags = model.blogTags
      ? model.blogTags
          .filter(bt => !bt.isDeleted)
          .map(bt => bt.tagId)
      : [];
  }

  getTagName(tagId: number): string {
    const tag = this.tagList.find(t => t.id === tagId);
    return tag ? tag.name : '';
  }

  deleteBlog(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
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
            this.getAllBlogs();

            Swal.fire({
              title: "Deleted!",
              text: "Your blog has been deleted.",
              icon: "success",
              confirmButtonColor: "#28a745"
            });
          },
          error: err => {
            console.error('Delete error:', err);
            Swal.fire({
              title: "Error!",
              text: "An error occurred while deleting.",
              icon: "error"
            });
          }
        });
      }
    });
  }



}
