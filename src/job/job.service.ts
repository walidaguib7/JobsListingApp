import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './job.entity';
import { Repository } from 'typeorm';
import { EmployerService } from 'src/employer/employer.service';
import { CreateJobDto } from './dtos/create.dto';
import { UpdateJobDto } from './dtos/update.dto';
import { CachingService } from 'config/caching/caching.service';
import { PaginationDto } from 'helpers/PaginatoinDto';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job) private readonly jobsRepository: Repository<Job>,
    private readonly employerService: EmployerService,
    private readonly cachingService: CachingService,
  ) {}

  async getAllJobs(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const key = `jobs_${page}_${limit}`;
    const cachedJobs = await this.cachingService.getFromCache<Job[]>(key);
    if (cachedJobs) return cachedJobs;
    const [jobs, total] = await this.jobsRepository.findAndCount({
      relations: {
        employer: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    await this.cachingService.setAsync(key, jobs);
    return { jobs, limit, page, total };
  }

  async getJob(id: number) {
    const key = `job_${id}`;
    const cachedJob = await this.cachingService.getFromCache<Job>(key);
    if (cachedJob != null) return cachedJob;
    const job = await this.jobsRepository.findOneBy({
      id: id,
    });
    if (!job) throw new NotFoundException();
    await this.cachingService.setAsync(key, job);
    return job;
  }

  async createJob(dto: CreateJobDto) {
    const employer = await this.employerService.getEmployer(dto.employerId);
    const job = this.jobsRepository.create(dto);
    job.employer = employer;
    await this.jobsRepository.save(job);
    await this.cachingService.removeByPattern('jobs');
    await this.cachingService.removeByPattern('job');
  }

  async updateJob(id: number, dto: UpdateJobDto) {
    const employer = await this.employerService.getEmployer(dto.employerId);
    const job = await this.jobsRepository.findOne({ where: { id: id } });
    if (!job) throw new NotFoundException();
    job.title = dto.title;
    job.description = dto.description;
    job.type = dto.type;
    job.location = dto.location;
    job.salary = dto.salary;
    await this.jobsRepository.save(job);
    await this.cachingService.removeByPattern('jobs');
    await this.cachingService.removeByPattern('job');
  }

  async deleteJob(id: number) {
    const job = await this.jobsRepository.findOne({ where: { id: id } });
    if (!job) throw new NotFoundException();
    await this.jobsRepository.remove(job);
    await this.cachingService.removeByPattern('jobs');
    await this.cachingService.removeByPattern('job');
  }
}
