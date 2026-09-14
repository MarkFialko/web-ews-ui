import type {
  ItServiceDto,
  WorkgroupCategoryDto,
  WorkgroupDto,
  WorkgroupMemberDto,
} from "@modules/ticket-actions/types";

/**
 * web-ews-middle/static-info/* отдаёт один и тот же ответ для двух разных
 * контрактов в коде (см. @modules/ticket-actions/types/staticInfo и
 * @shared/queries/dictionaryApi): один читает `taskType`/`code`, другой —
 * `value`. Мок содержит оба набора полей, чтобы устроить обоих потребителей.
 */
type StaticInfoItemMock = {
  taskType: "INC" | "SR" | "SRT" | "INCT";
  code: string;
  value: string;
  label: string;
};

export const workgroupsMock: WorkgroupCategoryDto[] = [
  {
    title: "Техническая поддержка",
    isActive: true,
    workgroupItems: [
      {
        id: 1,
        title: "1-я линия поддержки",
        bank: "Сбербанк",
        isActive: true,
        description: "Первая линия технической поддержки",
        workgroupSettings: [
          {
            id: 101,
            service: "1С:Предприятие",
            use_root_service: false,
            information: "",
            userParameter: "",
            isActive: true,
            createZpi: true,
            createZnr: true,
            route: true,
            ks_in_weekend: false,
            ks_in_agreement: 0,
            ks_percent: 0,
            stage_znr: 1,
            time_breach: 0,
            time_zone: false,
            checklistName: "",
          },
        ],
      },
      {
        id: 2,
        title: "2-я линия поддержки",
        bank: "Сбербанк",
        isActive: true,
        description: "Вторая линия технической поддержки",
        workgroupSettings: [],
      },
    ],
  },
];

export const workgroupMembersMock: WorkgroupMemberDto[] = [
  {
    userId: "10023458",
    businessId: "SR0001030593",
    ucpId: "ucp-10023458",
    personalNumber: "10023458",
    organizationId: "org-1",
    typePerson: "EMPLOYEE",
    fired: "N",
    isCoordinator: true,
    fullName: "Соколов Артём Викторович",
  },
  {
    userId: "10034567",
    businessId: "SR0001030593",
    ucpId: "ucp-10034567",
    personalNumber: "10034567",
    organizationId: "org-1",
    typePerson: "EMPLOYEE",
    fired: "N",
    isCoordinator: false,
    fullName: "Петрова Мария Игоревна",
  },
];

export const workgroupByLabelMock: WorkgroupDto = {
  id: "wg-1",
  groupId: "group-1",
  businessId: "SR0001030593",
  label: "1-я линия поддержки",
  chiefId: "10023458",
  isActive: true,
};

export const itServiceMock: ItServiceDto = {
  guid: "8f14e45f-ceea-4a5b-8c1d-1f2e3a4b5c6d",
  code: "1C-ENTERPRISE",
  label: "1С:Предприятие",
  category: "APPLICATION",
  owner: "Департамент технической поддержки",
  isActive: true,
};

export const closeCodesMock: { items: StaticInfoItemMock[] } = {
  items: [
    { taskType: "INC", code: "RESOLVED", value: "RESOLVED", label: "Решено" },
    {
      taskType: "INC",
      code: "DUPLICATE",
      value: "DUPLICATE",
      label: "Дубликат",
    },
    {
      taskType: "SR",
      code: "COMPLETED",
      value: "COMPLETED",
      label: "Выполнено",
    },
  ],
};

export const lateReasonMock: { items: StaticInfoItemMock[] } = {
  items: [
    {
      taskType: "INC",
      code: "AWAITING_CLIENT",
      value: "AWAITING_CLIENT",
      label: "Ожидание ответа клиента",
    },
    {
      taskType: "INC",
      code: "EXTERNAL_VENDOR",
      value: "EXTERNAL_VENDOR",
      label: "Ожидание внешнего поставщика",
    },
  ],
};

export const incReasonMock: { items: StaticInfoItemMock[] } = {
  items: [
    {
      taskType: "INC",
      code: "HARDWARE_FAILURE",
      value: "HARDWARE_FAILURE",
      label: "Аппаратный сбой",
    },
    {
      taskType: "INC",
      code: "SOFTWARE_ERROR",
      value: "SOFTWARE_ERROR",
      label: "Программная ошибка",
    },
  ],
};
