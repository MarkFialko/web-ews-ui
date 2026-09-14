import type {
  EmployeeArmsInfo,
  TicketsResponse,
  UserAccessDto,
  UserInfoResponse,
  VipUserInfoCheckDto,
} from "@modules/request-card/types";
import type { EmployeePhotoResponse } from "@modules/request-card/api";

export const vipVerifyMock: VipUserInfoCheckDto = {
  employeeNumber: "30012345",
  vip: false,
  isVip: false,
};

/**
 * Ответ web-ews-middle/employee/users/:employeeNumber — используется и
 * @modules/request-card (getEmployeeByNumber), и @modules/call
 * (getEmployeePhones через userMainInfo.phones).
 */
export const employeeInfoMock: UserInfoResponse = {
  userNumber: "30012345",
  isVIP: false,
  userMainInfo: {
    employeeNumber: "30012345",
    userFullName: "Смирнова Ольга Павловна",
    tb: "Московский банк",
    vsp: "ВСП 1234/056",
    department: "Дополнительный офис №1234",
    structure: "Управление продаж и обслуживания",
    position: "Специалист по обслуживанию клиентов",
    location: "г. Москва, ул. Вавилова, д. 19",
    localTime: "2026-09-14T12:00:00+03:00",
    phones: [
      { number: "+74957654321", type: "WORK", isMain: true, isVerified: true },
      {
        number: "+79161234567",
        type: "MOBILE",
        isMain: false,
        isVerified: true,
      },
    ],
    mails: [
      { address: "o.p.smirnova@sberbank.ru", type: "WORK", isMain: true },
    ],
  },
  userLabelsInfo: [],
};

export const employeeArmsMock: EmployeeArmsInfo = {
  NetBIOSName: "WS-MSK-01234",
  ARMDomain: "CORP.SBER.RU",
  userName: "o.p.smirnova",
  userDomain: "CORP",
  loginSigma: "o.smirnova",
  loginAlpha: "smirnovaop",
  loginOmega: "smirnova.o",
  sourceSegment: "Корпоративный сегмент",
  model: "OptiPlex 7090",
  manufacturer: "Dell Inc.",
  OSName: "Windows 10 Enterprise",
  OSVersion: "10.0.19045",
  OSDirectory: "C:\\Windows",
  installDate: "2023-02-10",
  IPAddress: "10.45.12.34",
  IPRoute: "10.45.12.1",
  MACAddress: "00:1A:2B:3C:4D:5E",
  CPUName: "Intel Core i5-10500",
  serialBios: "SN-7Y8X9Z1",
  ramVol: "16 GB",
  procFreq: "3.1 GHz",
  hddVol: "512 GB SSD",
  location: "г. Москва, ул. Вавилова, д. 19",
  heartBeatDiscoveryDataRecordDate: "2026-09-14T09:00:00Z",
  ou: "OU=Workstations,OU=MSK,DC=corp,DC=sber,DC=ru",
  biosPassStat: "Enabled",
};

export const employeePhotoMock: EmployeePhotoResponse = {
  photoData:
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
};

export const accessInfoMock: UserAccessDto[] = [
  { userName: "o.p.smirnova", rName: "1С:Предприятие", aStatus: 1 },
  { userName: "o.p.smirnova", rName: "АС Сберассист", aStatus: 1 },
  { userName: "o.p.smirnova", rName: "Корпоративная почта", aStatus: 0 },
];

export const lastTicketsMock: TicketsResponse = {
  onMe: [
    {
      ticketNumber: "SR0001030593",
      createdAt: "2026-09-12T10:10:00Z",
      subject: "Не открывается 1С:Предприятие",
      status: "В работе",
      priority: "HIGH",
      workGroup: "1-я линия поддержки",
      assignee: "Соколов Артём Викторович",
      dueDate: "2026-09-13T10:10:00Z",
      description:
        "При запуске 1С:Предприятие появляется ошибка подключения к серверу.",
      dataQuality: "FULL",
    },
  ],
  onGroup: [],
  onOther: [],
  closed: [
    {
      ticketNumber: "SR0000998812",
      createdAt: "2026-08-20T09:00:00Z",
      subject: "Не работает сканер штрихкодов",
      status: "Закрыт",
      priority: "LOW",
      workGroup: "1-я линия поддержки",
      assignee: "Соколов Артём Викторович",
      dueDate: "2026-08-21T09:00:00Z",
      description: "Сканер не считывает штрихкоды, заменён кабель USB.",
      dataQuality: "FULL",
    },
  ],
  activeCount: 1,
  dataQuality: "FULL",
};
