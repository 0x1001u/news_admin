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
  per_page?: number;
  title?: string;
  category_id?: number | null;
  status?: 'draft' | 'published' | 'archived' | null;
  tag_id?: number;
  sort_by?: 'published_at' | 'view_count';
  sort_order?: 'asc' | 'desc';
}
