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
  filteredCategoryList: ProductCategory[] = [];
  category: ProductCategory = new ProductCategory();
  editCategory: ProductCategory = new ProductCategory();
  searchText: string = '';
  errors: any = {}; // Holds validation errors

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
        this.filteredCategoryList = values;
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: err => console.error('Error loading categories:', err)
    })
  }

  filterCategories() {
    if (!this.searchText.trim()) {
      this.filteredCategoryList = this.categoryList;
    } else {
      this.filteredCategoryList = this.categoryList.filter(category =>
        category.categoryName.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }

  create() {
    this.errors = {};

    this.productCategoryService.create(this.category).subscribe({
      next: () => {
        Swal.fire({
          title: "Success!",
          text: "Category has been added successfully.",
          icon: "success",
          confirmButtonColor: "#0d6efd"
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

  onSelected(model: ProductCategory) {
    // Create a copy of the object (not a reference)
    this.editCategory = { ...model };
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
        this.productCategoryService.delete(id).subscribe({
          next: () => {
            this.getAll();
            Swal.fire({
              title: "Deleted!",
              text: "Category has been deleted.",
              icon: "success",
              confirmButtonColor: "#0d6efd"
            });
          },
          error: err => console.log(err)
        });
      }

      else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled",
          text: "Delete operation has been cancelled.",
          icon: "info",
          confirmButtonColor: "#6c757d"
        });
      }
    });
  }
}
