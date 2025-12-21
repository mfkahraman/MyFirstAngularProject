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
  coverImageFile: File | null = null;
  contentImageFile: File | null = null;
  editCoverImageFile: File | null = null;
  editContentImageFile: File | null = null;

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

  onCoverFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        title: 'Error!',
        text: 'Please select a valid image file.',
        icon: 'error'
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: 'Error!',
        text: 'Image file must be smaller than 5MB.',
        icon: 'error'
      });
      return;
    }

    // Store file for later upload
    this.coverImageFile = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.coverImagePreview = e.target?.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  onContentFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        title: 'Error!',
        text: 'Please select a valid image file.',
        icon: 'error'
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: 'Error!',
        text: 'Image file must be smaller than 5MB.',
        icon: 'error'
      });
      return;
    }

    // Store file for later upload
    this.contentImageFile = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.contentImagePreview = e.target?.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  onEditCoverFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        title: 'Error!',
        text: 'Please select a valid image file.',
        icon: 'error'
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: 'Error!',
        text: 'Image file must be smaller than 5MB.',
        icon: 'error'
      });
      return;
    }

    // Store file for later upload
    this.editCoverImageFile = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.editCoverImagePreview = e.target?.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  onEditContentFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        title: 'Error!',
        text: 'Please select a valid image file.',
        icon: 'error'
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: 'Error!',
        text: 'Image file must be smaller than 5MB.',
        icon: 'error'
      });
      return;
    }

    // Store file for later upload
    this.editContentImageFile = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.editContentImagePreview = e.target?.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
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

    // Build FormData with all blog properties and files
    const formData = new FormData();
    formData.append('Title', this.blog.title || '');
    formData.append('Content', this.blog.content || '');
    formData.append('CategoryId', this.blog.categoryId?.toString() || '');
    formData.append('WriterId', this.blog.writerId?.toString() || '');

    // Append tag IDs
    this.selectedTags.forEach((tagId, index) => {
      formData.append(`TagIds[${index}]`, tagId.toString());
    });

    // Append image files if selected
    if (this.coverImageFile) {
      formData.append('CoverImageFile', this.coverImageFile);
    }
    if (this.contentImageFile) {
      formData.append('ContentImageFile', this.contentImageFile);
    }

    this.blogService.create(formData).subscribe({
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
        this.coverImageFile = null;
        this.contentImageFile = null;
      },
      error: err => {
        this.errors = err.error.errors;
        this.cdr.detectChanges();
      }
    })
  }

  updateBlog() {
    // Build FormData with all blog properties and files
    const formData = new FormData();
    formData.append('Title', this.editBlog.title || '');
    formData.append('Content', this.editBlog.content || '');
    formData.append('CategoryId', this.editBlog.categoryId?.toString() || '');
    formData.append('WriterId', this.editBlog.writerId?.toString() || '');

    // Append tag IDs
    this.editSelectedTags.forEach((tagId, index) => {
      formData.append(`TagIds[${index}]`, tagId.toString());
    });

    // Append image files only if new ones are selected
    if (this.editCoverImageFile) {
      formData.append('CoverImageFile', this.editCoverImageFile);
    }
    if (this.editContentImageFile) {
      formData.append('ContentImageFile', this.editContentImageFile);
    }

    this.blogService.update(this.editBlog.id, formData).subscribe({
      next: () => {
        this.getAllBlogs();
        this.editCoverImagePreview = null;
        this.editContentImagePreview = null;
        this.editSelectedTags = [];
        this.editCoverImageFile = null;
        this.editContentImageFile = null;

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
    this.editCoverImageFile = null;
    this.editContentImageFile = null;

    // Load blog's current tags (only non-deleted ones)
    this.editSelectedTags = model.blogTags
      ? model.blogTags
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

  /**
   * Get full image URL by prepending server address
   */
  getImageUrl(path: string | null | undefined): string {
    if (!path) return 'assets/img/blog/blog-1.jpg';

    // If path already starts with http or is a data URL, return as is
    if (path.startsWith('http') || path.startsWith('data:')) {
      return path;
    }

    // Prepend server URL to relative path
    return `https://localhost:7000${path}`;
  }

  /**
   * Handle image load errors
   */
  onImageError(event: any): void {
    console.error('Image failed to load:', event.target.src);
    event.target.src = 'assets/img/blog/blog-1.jpg';
  }

}
