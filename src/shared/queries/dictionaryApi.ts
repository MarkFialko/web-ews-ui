import { baseApi } from "@shared/api";

interface StaticInfoItemDto {
  value: string;
  label: string;
}

interface CloseCodesResponseDto {
  items: StaticInfoItemDto[];
}

interface IncReasonResponseDto {
  items: StaticInfoItemDto[];
}

interface LateReasonResponseDto {
  items: StaticInfoItemDto[];
}

interface HashtagDto {
  id: number;
  hashtag: string;
  title: string;
  hint: string;
}

export interface GroupHashtagDto {
  group: {
    id: number;
    name: string;
    tags: HashtagDto[];
  };
}

export interface DictionaryGroupDto {
  id: number | null;
  name: string | null;
  parentId: number | null;
  tags: HashtagDto[];
}

type HashtagsResponseDto = GroupHashtagDto[];

export const dictionaryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCloseCodes: builder.query<CloseCodesResponseDto, string | void>({
      query: (entityType) => ({
        url: "web-ews-middle/static-info/close-codes",
        method: "GET",
        params: entityType ? { taskType: entityType } : undefined,
      }),
    }),
    getIncReason: builder.query<IncReasonResponseDto, void>({
      query: () => ({
        url: "web-ews-middle/static-info/inc/inc-reason",
        method: "GET",
      }),
    }),
    getLateReason: builder.query<LateReasonResponseDto, void>({
      query: () => ({
        url: "web-ews-middle/static-info/late-reasons",
        method: "GET",
      }),
    }),
    getHashtags: builder.query<
      HashtagsResponseDto,
      { unit: string; direction: string }
    >({
      query: (dto) => {
        const params = new URLSearchParams();

        for (const [key, value] of Object.entries(dto)) {
          params.append(key, value);
        }

        return {
          url: `web-ews-middle/compendium/tags?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: DictionaryGroupDto[]) => {
        const result: HashtagsResponseDto = [];

        for (const group of response) {
          if (group.tags.length > 0 && group.parentId !== null) {
            result.push({
              group: {
                id: group.id!,
                name: group.name!,
                tags: group.tags,
              },
            });
          }
          if (group.parentId === null) {
            result.push({
              group: {
                id: null,
                name: "",
                tags: group.tags,
              },
            });
          }
        }

        return result;
      },
    }),
  }),
});

export const {
  useGetCloseCodesQuery,
  useGetIncReasonQuery,
  useGetLateReasonQuery,
  useGetHashtagsQuery,
} = dictionaryApi;
