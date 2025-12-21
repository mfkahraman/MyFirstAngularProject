import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'writerSearch',
  standalone: true
})
export class WriterSearchPipe implements PipeTransform {
  transform(writers: any[], searchTerm: string): any[] {
    if (!writers || !searchTerm) return writers;
    const term = searchTerm.toLowerCase();
    return writers.filter(writer =>
      (writer.fullName && writer.fullName.toLowerCase().includes(term)) ||
      (writer.bio && writer.bio.toLowerCase().includes(term))
    );
  }
}
