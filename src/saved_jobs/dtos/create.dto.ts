import { IsNumber, NotEquals } from 'class-validator';

export class SaveJob {
  @IsNumber()
  @NotEquals(0)
  userId: number;
  @IsNumber()
  @NotEquals(0)
  jobId: number;
}
