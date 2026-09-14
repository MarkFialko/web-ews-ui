type ProtocolTarget = "user" | "engineer";
type WorklogTone = "default" | "info" | "warning" | "success";

type KnowledgeArticleContentKey =
  | "engineerSolution"
  | "userSolution"
  | "sbsSolution";

export type KnowledgeArticleBind =
  | {
      id: string;
      label: string;
      description: string;
      action: {
        type: "protocol";
        target: ProtocolTarget;
        contentKey: KnowledgeArticleContentKey;
      };
    }
  | {
      id: string;
      label: string;
      description: string;
      action: {
        type: "hashtag";
        tag: string;
      };
    }
  | {
      id: string;
      label: string;
      description: string;
      action: {
        type: "ticket-action";
        group: string;
        resolution: string;
      };
    }
  | {
      id: string;
      label: string;
      description: string;
      action: {
        type: "worklog";
        action: string;
        details: string;
        tone?: WorklogTone;
      };
    };

export type KnowledgeBaseArticle = {
  shId: string;
  title: string;
  service: string;
  updatedAt: string;
  problem: string;
  engineerSolution: string;
  userSolution: string;
  sbsSolution: string;
  keywords: string[];
  binds: KnowledgeArticleBind[];
};

export const buildKnowledgeArticleUrl = (shTag: string) =>
  `https://sberhelp.sberbank.ru/sberhelp/page/${shTag.toLocaleLowerCase().replace(/^SH-/i, "")}`;
