import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './job.entity';
import { FindManyOptions, Like, Repository, In } from 'typeorm';
import { EmployerService } from 'src/employer/employer.service';
import { CreateJobDto } from './dtos/create.dto';
import { UpdateJobDto } from './dtos/update.dto';
import { CachingService } from 'config/caching/caching.service';
import { PaginationDto } from './dtos/PaginatoinDto';
import { Category } from 'src/categories/category.entity';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job) private readonly jobsRepository: Repository<Job>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly employerService: EmployerService,
    private readonly cachingService: CachingService,
  ) {}

  async getAllJobs(paginationDto: PaginationDto) {
    const { page, limit, title, location, type, categories } = paginationDto; // Add `categoryIds` to the DTO
    const key = `jobs_${page}_${limit}_${title}_${type}_${location}_${categories}`;
    const cachedJobs = await this.cachingService.getFromCache<Job[]>(key);
    if (cachedJobs) return cachedJobs;

    const query = this.jobsRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.employer', 'employer')
      .leftJoinAndSelect('job.categories', 'categories')
      .skip((page - 1) * limit)
      .take(limit);

    // Add filters
    if (title) {
      query.andWhere('job.title LIKE :title', { title: `%${title}%` });
    }
    if (type) {
      query.andWhere('job.type = :type', { type });
    }
    if (location) {
      query.andWhere('job.location LIKE :location', {
        location: `%${location}%`,
      });
    }
    if (categories && Array.isArray(categories) && categories.length > 0) {
      query.andWhere('categories.id IN (:...categories)', { categories });
    }

    const [jobs, total] = await query.getManyAndCount();
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
    if (!employer) {
      throw new Error('Employer not found');
    }

    // Create the job and associate the employer
    const job = this.jobsRepository.create(dto);
    job.employer = employer;

    // Resolve categories
    if (dto.categories && dto.categories.length > 0) {
      const categories = await this.categoryRepository.find({
        where: { title: In(dto.categories) },
      });

      if (categories.length !== dto.categories.length) {
        throw new Error('Some categories were not found');
      }

      job.categories = categories;
    } else {
      job.categories = [];
    }

    // Save the job with its relationships
    await this.jobsRepository.save(job);

    // Invalidate cache for jobs
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
    job.employer = employer;
    // Resolve categories
    if (dto.categories && dto.categories.length > 0) {
      const categories = await this.categoryRepository.find({
        where: { title: In(dto.categories) },
      });

      if (categories.length !== dto.categories.length) {
        throw new Error('Some categories were not found');
      }

      job.categories = categories;
    } else {
      job.categories = [];
    }
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
