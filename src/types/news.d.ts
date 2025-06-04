export interface NewsItem {
  id: number;
  title: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  category_id: number;
  author_id: number;
}

export interface NewsQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  category?: number;
}