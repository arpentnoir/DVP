export interface UserProfile {
  sub?: string;
  abn?: string;
}

export interface Pagination {
  nextCursor: string | null;
  prevCursor: string | null;
  limit: number;
}
