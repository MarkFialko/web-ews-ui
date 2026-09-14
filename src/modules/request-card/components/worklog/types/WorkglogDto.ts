import type { WorklogAction } from "@shared/worklog-logger";
import type { WorklogSource } from "@shared/worklog";

export interface WorklogActionAuthor {
  personalNumber: string;
  engineerName: string;
}

export interface WorklogDto {
  id: string;
  timestamp: string;
  author: WorklogActionAuthor;
  description: string;
  source: WorklogSource;
  action: WorklogAction;
  task: string;
}
