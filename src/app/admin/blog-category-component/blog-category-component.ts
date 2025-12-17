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
  filteredBlogCategoryList: BlogCategory[] = [];
  blogCategory: BlogCategory = new BlogCategory();
  editBlogCategory: BlogCategory = new BlogCategory();
  searchText: string = '';
  errors: any = {}; // Holds validation errors

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
        this.filteredBlogCategoryList = values;
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: err => console.error('Error loading blog categories:', err)
    })
  }

  filterCategories() {
    if (!this.searchText.trim()) {
      this.filteredBlogCategoryList = this.blogCategoryList;
    } else {
      this.filteredBlogCategoryList = this.blogCategoryList.filter(category =>
        category.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }

  create() {
    this.errors = {};

    this.blogCategoryService.create(this.blogCategory).subscribe({
      next: () => {
        Swal.fire({
          title: "Success!",
          text: "Category has been added successfully.",
          icon: "success",
          confirmButtonColor: "#0d6efd"
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
          title: "Updated!",
          text: "Category has been updated successfully.",
          icon: "success",
          confirmButtonColor: "#0d6efd"
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
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
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
            // Refresh the list
            this.getAll();

            Swal.fire({
              title: "Deleted!",
              text: "Category has been deleted.",
              icon: "success",
              confirmButtonColor: "#0d6efd"
            });
          },
          error: err => {
            console.error('Delete error:', err);
            Swal.fire({
              title: "Error!",
              text: "An error occurred during deletion.",
              icon: "error",
              confirmButtonColor: "#dc3545"
            });
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled",
          text: "Delete operation has been cancelled.",
          icon: "info",
          confirmButtonColor: "#6c757d"
        });
      }
    });
  }

  onSelected(model: BlogCategory) {
    // Create a copy of the object (not a reference)
    this.editBlogCategory = { ...model };
  }
}
