import { Writer } from "./writer-model";

export class Comment{
  id: number;
  blogId: number;
  writerId: number;
  content: string;
  createdAt: Date;
  writer: Writer;
}
