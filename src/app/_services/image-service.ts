import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

export interface ImageResult {
  base64: string;
  preview: string;
  fileName: string;
  fileSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private readonly MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  constructor() { }

  /**
   * Dosya seçimi ve Base64'e dönüştürme
   * @param file Seçilen dosya
   * @param maxSizeMB Maksimum dosya boyutu (MB), varsayılan 2MB
   * @returns Observable<ImageResult>
   */
  processImage(file: File, maxSizeMB: number = 2): Observable<ImageResult> {
    return new Observable(observer => {
      // Dosya tipi kontrolü
      if (!this.isValidImageType(file.type)) {
        Swal.fire({
          title: "Hata!",
          text: "Lütfen geçerli bir görsel dosyası seçin (JPG, PNG, GIF, WebP).",
          icon: "error"
        });
        observer.error('Invalid file type');
        return;
      }

      // Dosya boyutu kontrolü
      const maxSize = maxSizeMB * 1024 * 1024;
      if (file.size > maxSize) {
        Swal.fire({
          title: "Hata!",
          text: `Görsel dosyası ${maxSizeMB}MB'dan küçük olmalıdır (Veritabanı için).`,
          icon: "error"
        });
        observer.error('File too large');
        return;
      }

      // Base64'e dönüştür
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;

        observer.next({
          base64: base64String,
          preview: base64String,
          fileName: file.name,
          fileSize: file.size
        });
        observer.complete();
      };

      reader.onerror = () => {
        Swal.fire({
          title: "Hata!",
          text: "Dosya okunurken bir hata oluştu.",
          icon: "error"
        });
        observer.error('File read error');
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * Event'ten dosya seçimi ve işleme
   * @param event Input change event
   * @param maxSizeMB Maksimum dosya boyutu (MB)
   * @returns Observable<ImageResult> veya null
   */
  handleFileSelection(event: any, maxSizeMB: number = 2): Observable<ImageResult> | null {
    const file = event.target.files?.[0];

    if (!file) {
      return null;
    }

    return this.processImage(file, maxSizeMB);
  }

  /**
   * Dosya tipinin geçerli olup olmadığını kontrol eder
   */
  private isValidImageType(fileType: string): boolean {
    return this.ALLOWED_TYPES.includes(fileType);
  }

  /**
   * Base64 string'in boyutunu hesaplar (KB)
   */
  getBase64Size(base64String: string): number {
    const base64Length = base64String.length - (base64String.indexOf(',') + 1);
    return Math.round((base64Length * 3) / 4 / 1024);
  }

  /**
   * Dosya boyutunu okunabilir formata çevirir
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Görsel önizlemesi için güvenli data URL kontrolü
   */
  isValidDataUrl(url: string): boolean {
    return url?.startsWith('data:image/') || false;
  }
}
