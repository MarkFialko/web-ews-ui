import { baseApi } from "@shared/api";

export interface CreateZpiZnrPayload {
  templateVersionId: string;
  initiator: string;
  workGroup: string;
  itService: string;
  targetDate: string;
  description: string;
  finalStatus: "IN_WORKGROUP";
}

export interface CreateZpiPayload extends CreateZpiZnrPayload {
  incidentId: string;
  step: string;
}

export interface CreateZnrPayload extends CreateZpiZnrPayload {
  requestId: string;
  assignee: string;
  stepNumber: string;
  title: string;
  tags: string;
}

interface FieldConfig {
  code: string;
  name: string;
  value: boolean;
}

interface TemplateField {
  code: string;
  name: string;
  isDynamic: boolean;
  type: string;
  enumId: string;
  config: FieldConfig[];
  isMandatory: boolean;
  isEditable: boolean;
  defaultValue: string;
}

export interface TemplateDTO {
  templateId: string;
  versionId: string;
  isLatest: boolean;
  businessId: string;
  title: string;
  description: string;
  resourceType: string;
  templateType: string;
  isActive: boolean;
  fields: TemplateField[];
}

const createZpiZnrApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTemplateUUID: builder.query<TemplateDTO, string>({
      query: (businessId) => ({
        url: `web-ews-middle/esm-datasource/template/${businessId}`,
        method: "GET",
      }),
    }),
    createZpi: builder.mutation<unknown, CreateZpiPayload>({
      query: ({ incidentId, ...dto }) => ({
        url: `web-ews-middle/esm-actions/inc/${incidentId}/inct`,
        method: "POST",
        body: dto,
      }),
    }),
    createZnr: builder.mutation<unknown, CreateZnrPayload>({
      query: ({ requestId, ...dto }) => ({
        url: `web-ews-middle/esm-actions/sr/${requestId}/srt`,
        method: "POST",
        body: dto,
      }),
    }),
  }),
});

export const {
  useCreateZpiMutation,
  useCreateZnrMutation,
  useLazyGetTemplateUUIDQuery,
} = createZpiZnrApi;
