import { apiServer1 } from "./api-server-1";

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  publishedAt: string;
  urlToImage: string;
  source: {
    id: string;
    name: string;
  };
  category: string;
  url: string;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export const newsApi = apiServer1.injectEndpoints({
  endpoints: (builder) => ({
    getEducationalNews: builder.query<
      NewsResponse,
      { category?: string; page?: number; pageSize?: number }
    >({
      query: ({ category = "education", page = 1, pageSize = 10 }) => ({
        url: `/news/educational`,
        method: "GET",
        params: {
          category,
          page,
          pageSize,
          sortBy: "publishedAt",
        },
      }),
      providesTags: ["News"],
    }),

    getNewsCategories: builder.query<string[], void>({
      query: () => ({
        url: `/news/categories`,
        method: "GET",
      }),
      providesTags: ["NewsCategories"],
    }),

    getNewsById: builder.query<NewsArticle, string>({
      query: (id) => ({
        url: `/news/${id}`,
        method: "GET",
      }),
      providesTags: ["News"],
    }),

    searchNews: builder.query<NewsResponse, { query: string; page?: number }>({
      query: ({ query, page = 1 }) => ({
        url: `/news/search`,
        method: "GET",
        params: {
          q: query,
          page,
          pageSize: 10,
          language: "en",
          sortBy: "relevancy",
        },
      }),
      providesTags: ["News"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetEducationalNewsQuery,
  useGetNewsCategoriesQuery,
  useGetNewsByIdQuery,
  useSearchNewsQuery,
  useLazyGetEducationalNewsQuery,
  useLazySearchNewsQuery,
} = newsApi;
