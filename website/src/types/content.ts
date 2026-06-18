export type ContentStatus =
  | "draft"
  | "in-review"
  | "canon-review"
  | "published"
  | "archived";

export interface SeoFields {
  seoTitle: string;
  seoDescription: string;
  canonicalUrl?: string;
}

export interface Article extends SeoFields {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  status: ContentStatus;
  canonReferences: string[];
}

export interface LeadMagnet extends SeoFields {
  title: string;
  subtitle: string;
  slug: string;
  deliveryPath: string;
  emailTag: string;
  sourceTags: string[];
  status: ContentStatus;
}

