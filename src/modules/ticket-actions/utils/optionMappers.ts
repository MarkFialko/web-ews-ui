import type { TicketActionEntityType } from "@shared/request";
import type { ClosureOption } from "../model/closureCodes";
import type {
  CloseCodesResponseDto,
  IncReasonResponseDto,
  LateReasonResponseDto,
  WorkgroupCategoryDto,
  WorkgroupMemberDto,
} from "../types";

/** Closure codes → опции дропдауна, отфильтрованные по taskType */
export const mapCloseCodes = (
  resp: CloseCodesResponseDto | null,
  entityType: TicketActionEntityType,
): ClosureOption[] =>
  (resp?.items ?? [])
    .filter((i) => entityType === i.taskType)
    .map((i) => ({ value: i.code, label: i.label, disabled: false }));

/** Incident reasons → опции (нефильтрованные — сущность зашита в URL) */
export const mapIncReasons = (
  resp?: IncReasonResponseDto | null,
): ClosureOption[] =>
  (resp?.items ?? []).map((i) => ({
    value: i.code,
    label: i.label,
    disabled: false,
  }));

/** Late reasons → опции, отфильтрованные по taskType */
export const mapLateReasons = (
  resp: LateReasonResponseDto | null,
  entityType?: TicketActionEntityType,
): ClosureOption[] =>
  (resp?.items ?? [])
    .filter((i) => entityType === i.taskType)
    .map((i) => ({ value: i.code, label: i.label, disabled: false }));

/** Workgroup categories → плоский список уникальных title */
export const mapWorkgroupTitles = (cats: WorkgroupCategoryDto[]): string[] =>
  Array.from(
    new Map(
      cats.flatMap((c) =>
        c.workgroupItems.map((i) => [i.title, i.title] as const),
      ),
    ).values(),
  );

/** Members → опции для FormInputAutocomplete */
export const mapMembersToOptions = (
  members: WorkgroupMemberDto[],
): Array<{ label: string; value: string }> =>
  (members ?? []).map((m) => ({
    label: m.fullName ?? "",
    value: m.userId ?? m.personalNumber ?? "",
  }));

/** strings → {label, value} для autocomplete */
export const toLabelValue = (
  items: string[],
): Array<{ label: string; value: string }> =>
  items.map((s) => ({ label: s, value: s }));
