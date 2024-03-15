export interface AcademicYearData {
  title: string;
}

export interface Pagination {
  limit: number;
  skip: number;
}

export interface SearchWithPagination extends Pagination {
  query: string;
}


export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string
}