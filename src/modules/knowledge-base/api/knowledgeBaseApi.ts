import { baseApi } from "@shared/api/baseApi";

export type KnowledgeArticleResponse = {
  title?: string;
  tag?: string;
};

export type RelevantTopicResponse = {
  service?: string;
  problem?: string;
  title?: string;
  tag?: string;
  count?: number;
  mip?: string;
  mipPath?: string;
  timeStamp?: string;
};

export type ArticleDTO = {
  tag: string;
  articleTitle: string;
  problem: string | null;
  recommendations: string | null;
  solutionForUser: string | null;
  solutionForSbs: string | null;
};

export interface ShortArticleDTO {
  title: string | null;
  tag: string;
}

export interface RecommendationsDTO {
  recommendedArticle: ShortArticleDTO;
  additionalArticles: ShortArticleDTO[];
}

export const knowledgeBaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecommendations: builder.query<RecommendationsDTO, string>({
      query: (businessId: string) => ({
        url: `web-ews-middle/v2/knowledge/recommendations/${businessId}`,
        // url: `web-ews-middle/v2/knowledge/recommendations/SR0001030593`,
      }),
    }),
    getKnowledgeArticle: builder.query<ArticleDTO, string>({
      query: (shId) => ({
        url: `web-ews-middle/knowledge/full-article/${shId}`,
        // url: `web-ews-middle/knowledge/full-article/SH-43968345-7cc8-4cfd-9f9c-86c7a5e2efe5`,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetRecommendationsQuery, useLazyGetKnowledgeArticleQuery } =
  knowledgeBaseApi;
