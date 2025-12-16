import { BlogCategory } from "./blog-category-model";
import { BlogTag } from "./blog-tag-model";
import { Comment } from "./comment-model";
import { Writer } from "./writer-model";

export class Blog {
  id: number;
  title: string;
  content: string;
  coverImageUrl: string;
  contentImageUrl: string;
  createdAt: Date;
  writerId: number;
  writer: Writer;
  categoryId: number;
  category: BlogCategory;
  blogTags: BlogTag[];
  comments: Comment[];
}
