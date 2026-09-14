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

export interface DictionaryGroupDto {
  id: number | null;
  name: string | null;
  parentId: number | null;
  tags: HashtagDto[];
}

/**
 * Узел дерева тегов. `id === null` бывает только у единственного
 * псевдоузла "без группы" (исходная строка с id/parentId/name === null) —
 * у него всегда `children: []`, его tags показываются без заголовка группы.
 */
export interface HashtagGroupNode {
  id: number | null;
  name: string | null;
  tags: HashtagDto[];
  children: HashtagGroupNode[];
}

type HashtagsResponseDto = HashtagGroupNode[];

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
        const isUngrouped = (row: DictionaryGroupDto) =>
          row.id === null && row.parentId === null && row.name === null;

        const nodeById = new Map<number, HashtagGroupNode>();
        let ungrouped: HashtagGroupNode | null = null;

        for (const row of response) {
          if (isUngrouped(row)) {
            ungrouped = { id: null, name: null, tags: row.tags, children: [] };
            continue;
          }
          if (row.id === null) continue;
          nodeById.set(row.id, {
            id: row.id,
            name: row.name,
            tags: row.tags,
            children: [],
          });
        }

        const roots: HashtagGroupNode[] = [];

        for (const row of response) {
          if (isUngrouped(row) || row.id === null) continue;

          const node = nodeById.get(row.id)!;
          const parent =
            row.parentId !== null ? nodeById.get(row.parentId) : undefined;

          if (parent) {
            parent.children.push(node);
          } else {
            roots.push(node);
          }
        }

        return ungrouped ? [ungrouped, ...roots] : roots;
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
