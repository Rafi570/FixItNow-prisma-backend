export interface IServiceFilters {
    categoryId?: string;   // "type" filter -> category
    location?: string;
    minRating?: string;    // query params always come as string
    searchTerm?: string;
}