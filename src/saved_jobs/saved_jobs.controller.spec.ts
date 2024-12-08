import { Test, TestingModule } from '@nestjs/testing';
import { SavedJobsController } from './saved_jobs.controller';
import { SavedJobsService } from './saved_jobs.service';

describe('SavedJobsController', () => {
  let controller: SavedJobsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SavedJobsController],
      providers: [SavedJobsService],
    }).compile();

    controller = module.get<SavedJobsController>(SavedJobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
