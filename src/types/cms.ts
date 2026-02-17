export interface SanitySlug {
  current?: string;
}

export interface SanityImage {
  _type?: "image";
  asset?: {
    _ref?: string;
    _type?: "reference";
    url?: string;
  };
  alt?: string;
}

export interface ProjectCategoryData {
  title: string;
  slug?: SanitySlug;
  description?: string;
}

export interface ProjectCardData {
  _id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  featured: boolean;
  year: number;
  duration?: string;
  summary: string;
  medium: string[];
  tools: string[];
  categories: string[];
  coverImage?: SanityImage;
  coverVideo?: string;
}

export interface CreditEntry {
  _key?: string;
  name: string;
  role: string;
  link?: string;
}

export interface RichTextProcessBlock {
  _key: string;
  _type: "richTextBlock";
  heading?: string;
  content: Array<{
    _type: string;
    [key: string]: unknown;
  }>;
}

export interface ImageProcessBlock {
  _key: string;
  _type: "imageBlock";
  caption?: string;
  alt?: string;
  image?: SanityImage;
  beforeImage?: SanityImage;
  afterImage?: SanityImage;
}

export interface VideoProcessBlock {
  _key: string;
  _type: "videoBlock";
  caption?: string;
  posterImage?: SanityImage;
  cloudinaryUrl: string;
}

export interface GalleryProcessBlock {
  _key: string;
  _type: "galleryBlock";
  caption?: string;
  images: SanityImage[];
}

export interface MilestoneProcessBlock {
  _key: string;
  _type: "milestoneBlock";
  stepTitle: string;
  description: string;
  tools?: string[];
  timestamp?: string;
}

export interface QuoteProcessBlock {
  _key: string;
  _type: "quoteBlock";
  quote: string;
  attribution?: string;
}

export type ProcessBlock =
  | RichTextProcessBlock
  | ImageProcessBlock
  | VideoProcessBlock
  | GalleryProcessBlock
  | MilestoneProcessBlock
  | QuoteProcessBlock;

export interface ProjectDetailData extends ProjectCardData {
  challenge?: string;
  solution?: string;
  outcome?: string;
  processBlocks: ProcessBlock[];
  credits: CreditEntry[];
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: SanityImage;
}

export interface SiteSettingsData {
  siteTitle: string;
  siteDescription: string;
  manifestoKicker: string;
  manifestoTitle: string;
  manifestoBody: string;
  manifestoSubline?: string;
  aboutHeading?: string;
  aboutBody?: string;
  contactEmail?: string;
  instagramUrl?: string;
}

export interface InquiryPayload {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
  website?: string;
}

export interface InquirySuccessResponse {
  ok: true;
  message: string;
}

export interface InquiryErrorResponse {
  ok: false;
  errors: string[];
}

export type InquiryResponse = InquirySuccessResponse | InquiryErrorResponse;
