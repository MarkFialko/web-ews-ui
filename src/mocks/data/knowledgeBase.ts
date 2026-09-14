import type {
  ArticleDTO,
  RecommendationsDTO,
} from "@modules/knowledge-base/api/knowledgeBaseApi";

export const recommendationsMock: RecommendationsDTO = {
  recommendedArticle: {
    title: "Ошибка подключения к серверу 1С:Предприятие",
    tag: "1C-CONNECTION-ERROR",
  },
  additionalArticles: [
    { title: "Перезапуск службы терминального сервера", tag: "TS-RESTART" },
    {
      title: "Настройка сетевого подключения к серверу 1С",
      tag: "1C-NETWORK-SETUP",
    },
  ],
};

export const articleMock: ArticleDTO = {
  tag: "1C-CONNECTION-ERROR",
  articleTitle: "Ошибка подключения к серверу 1С:Предприятие",
  problem:
    "При запуске 1С:Предприятие пользователь видит ошибку «Не удалось установить соединение с сервером».",
  recommendations:
    "Проверить доступность сервера приложений 1С, перезапустить службу агента сервера, убедиться в корректности настроек сети.",
  solutionForUser:
    "Перезапустите приложение 1С:Предприятие. Если ошибка повторяется, обратитесь в техническую поддержку.",
  solutionForSbs:
    "1. Проверить доступность сервера 1С (ping, telnet на порт 1541).\n2. Перезапустить службу «1С:Предприятие 8.3 Сервер».\n3. Проверить логи кластера серверов.",
};
