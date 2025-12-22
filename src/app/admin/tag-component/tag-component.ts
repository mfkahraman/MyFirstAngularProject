import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Tag } from '../../_models/tag-model';
import { TagService } from '../../_services/tag-service';

@Component({
  selector: 'app-tag-component',
  standalone: false,
  templateUrl: './tag-component.html',
  styleUrl: './tag-component.css',
})
export class TagComponent implements OnInit {
  tagList: Tag[] = [];
  tag: Tag = new Tag();
  editTag: Tag = new Tag();
  errors: any = {};

  // Pagination
  page: number = 1;

  // Search
  searchTerm: string = '';
  onSearchChange(term: string) {
    this.searchTerm = term;
  }

  constructor(
    private tagService: TagService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.tagService.getAll().subscribe({
      next: (values) => {
        this.tagList = values;
        this.cdr.detectChanges();
      },
      error: err => console.error('Error loading data:', err)
    })
  }

  create() {
    this.errors = {};

    this.tagService.create(this.tag).subscribe({
      next: () => {
        Swal.fire({
          title: "Added!",
          text: "Category was successfully added.",
          icon: "success"
        });
        this.getAll();
        this.tag = new Tag();
      },
      error: err => {
        this.errors = err.error.errors;
        console.log(this.errors);
        this.cdr.detectChanges();
      }
    })
  }

  update() {
    this.tagService.update(this.editTag.id, this.editTag).subscribe({
      next: () => {
        this.getAll();

        Swal.fire({
          title: "Updated!",
          text: "Category was successfully updated.",
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

  delete (id: number) {
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
        this.tagService.delete(id).subscribe({
          next: () => {
            // Listeyi yenile
            this.getAll();

            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
              confirmButtonColor: "#28a745"
            });
          },
          error: err => {
            console.error('Delete error:', err);
            Swal.fire({
              title: "Error!",
              text: "An error occurred during deletion.",
              icon: "error"
            });
          }
        });
      }
    });
  }

  onSelected(model: Tag) {
    this.editTag = { ...model };
  }
}
