import { Tag } from "./tag-model";

export class BlogTag {
  id: number;
  blogId: number;
  tagId: number;
  tag: Tag;
  tags?: Tag[];  // Optional: Backend returns this in some endpoints
}
