import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './application.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { JobService } from 'src/job/job.service';
import { CachingService } from 'config/caching/caching.service';
import { CreateApplication } from './dtos/create.dto';
import { MediaService } from 'src/media/media.service';
import { UpdateApplication } from './dtos/update.dto';
import { throws } from 'assert';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    private readonly userService: UsersService,
    private readonly jobService: JobService,
    private readonly cachingService: CachingService,
    private readonly mediaService: MediaService,
  ) {}

  async getAllApplication() {
    var random = crypto.randomUUID();
    const key = `application_${random}`;
    const cachedApplications =
      await this.cachingService.getFromCache<Application[]>(key);
    if (cachedApplications) return cachedApplications;
    const applications = await this.applicationRepository.find({
      relations: {
        job: true,
        user: true,
        resume: true,
      },
    });
    await this.cachingService.setAsync(key, applications);
    return applications;
  }

  async getJobApplications(jobId: number) {
    var random = crypto.randomUUID();
    const key = `application_${jobId}_${random}`;
    const cachedApplications =
      await this.cachingService.getFromCache<Application[]>(key);
    if (cachedApplications) return cachedApplications;
    const job = await this.jobService.getJob(jobId);
    const applications = await this.applicationRepository.findOne({
      where: { job },
      relations: {
        job: true,
        user: true,
        resume: true,
      },
    });
    await this.cachingService.setAsync(key, applications);
    return applications;
  }

  async getApplication(id: number) {
    const key = `application_${id}`;
    const cachedApplications =
      await this.cachingService.getFromCache<Application[]>(key);
    if (cachedApplications) return cachedApplications;
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: {
        job: true,
        user: true,
        resume: true,
      },
    });
    if (!application) throw new NotFoundException();
    await this.cachingService.setAsync(key, application);
    return application;
  }

  async Apply(dto: CreateApplication) {
    const user = await this.userService.findbyId(dto.userId);
    const job = await this.jobService.getJob(dto.jobId);
    const resume = await this.mediaService.getFile(dto.resumeId);
    const result = this.applicationRepository.create({
      coverletter: dto.coverletter,
      resume,
      job,
      user,
      status: dto.status,
    });
    await this.applicationRepository.save(result);
    await this.cachingService.removeByPattern('application');
  }

  async updateApplication(id: number, dto: UpdateApplication) {
    const application = await this.applicationRepository.findOne({
      where: {
        id,
      },
    });
    if (!application) throw new NotFoundException();
    application.status = dto.status;
    await this.applicationRepository.save(application);
    await this.cachingService.removeByPattern('application');
  }

  async RemoveApplication(id: number) {
    const application = await this.applicationRepository.findOne({
      where: {
        id,
      },
    });
    if (!application) throw new NotFoundException();
    await this.applicationRepository.remove(application);
    await this.cachingService.removeByPattern('application');
  }
}
