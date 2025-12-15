import { WriterService } from './../../_services/writer-service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Writer } from '../../_models/writer-model';
import Swal from 'sweetalert2';
import { ImageService } from '../../_services/image-service';

@Component({
  selector: 'app-writer-component',
  standalone: false,
  templateUrl: './writer-component.html',
  styleUrl: './writer-component.css',
})
export class WriterComponent implements OnInit {
  writerList: Writer[] = [];
  writer: Writer = new Writer();
  editWriter: Writer = new Writer();
  errors: any = {};

  // Image handling
  imagePreview: string | null = null;
  editImagePreview: string | null = null;

  // Pagination
  page: number = 1;

  constructor(
    private writerService: WriterService,
    private imageService: ImageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.writerService.getAll().subscribe({
      next: (values) => {
        this.writerList = values;
        this.cdr.detectChanges();
      },
      error: err => console.error('Error loading data:', err)
    })
  }

  onFileSelected(event: any) {
    const imageObservable = this.imageService.handleFileSelection(event, 2);

    if (imageObservable) {
      imageObservable.subscribe({
        next: (result) => {
          this.imagePreview = result.preview;
          this.writer.imageUrl = result.base64;
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
          this.editWriter.imageUrl = result.base64;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Görsel yükleme hatası:', err);
        }
      });
    }
  }

  create() {
    this.errors = {};

    this.writerService.create(this.writer).subscribe({
      next: () => {
        Swal.fire({
          title: "Eklendi!",
          text: "Kategori başarıyla eklendi.",
          icon: "success"
        });
        this.getAll();
        this.writer = new Writer();
      },
      error: err => {
        this.errors = err.error.errors;
        console.log(this.errors);
        this.cdr.detectChanges();
      }
    })
  }

  update() {
    this.writerService.update(this.editWriter.id, this.editWriter).subscribe({
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
        this.writerService.delete(id).subscribe({
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

  onSelected(model: Writer) {
    this.editWriter = { ...model };
  }
}
