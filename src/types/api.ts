export type ApiError = {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
  timestamp?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export type ListParams = {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
};

export type ResourceStatus = "active" | "inactive" | "pending" | "deleted";

export type Timestamps = {
  createdAt: string;
  updatedAt: string;
};
