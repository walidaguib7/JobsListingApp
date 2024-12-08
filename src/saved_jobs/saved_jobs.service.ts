import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Saved_Jobs } from './saved_jobs.entity';
import { JobService } from 'src/job/job.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { SaveJob } from './dtos/create.dto';
import { CachingService } from 'config/caching/caching.service';

@Injectable()
export class SavedJobsService {
  constructor(
    @InjectRepository(Saved_Jobs)
    private readonly savedJobsRepository: Repository<Saved_Jobs>,
    private readonly userService: UsersService,
    private readonly jobService: JobService,
    private readonly cachingService: CachingService,
  ) {}

  async getAll() {
    const random = crypto.randomUUID();
    const key = `savedJobs_${random}`;
    const cachedValues =
      await this.cachingService.getFromCache<Saved_Jobs[]>(key);
    if (cachedValues) return cachedValues;
    const result = await this.savedJobsRepository.find({
      relations: {
        job: true,
        user: true,
      },
    });
    await this.cachingService.setAsync(key, result);
    return result;
  }

  async saveJob(dto: SaveJob) {
    const user = await this.userService.findbyId(dto.userId);
    if (!user) throw new NotFoundException();
    const job = await this.jobService.getJob(dto.jobId);
    if (!job) throw new NotFoundException();
    const saved_job = this.savedJobsRepository.create({
      job: job,
      user: user,
    });
    await this.savedJobsRepository.save(saved_job);
    await this.cachingService.removeByPattern('savedJobs');
  }

  async Unsave(id: number) {
    const model = await this.savedJobsRepository.findOneBy({ id: id });
    if (!model) throw new NotFoundException();
    await this.savedJobsRepository.remove(model);
    await this.cachingService.removeByPattern('savedJobs');
  }
}
