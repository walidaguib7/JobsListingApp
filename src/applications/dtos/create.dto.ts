import { ApplicationStatus } from 'utils/enums';

export class CreateApplication {
  coverletter: string;
  status: ApplicationStatus;
  resumeId: number;
  jobId: number;
  userId: number;
}
