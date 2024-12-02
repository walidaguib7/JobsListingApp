import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './job.entity';
import { Repository } from 'typeorm';
import { EmployerService } from 'src/employer/employer.service';
import { CreateJobDto } from './dtos/create.dto';
import { UpdateJobDto } from './dtos/update.dto';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job) private readonly jobsRepository: Repository<Job>,
    private readonly employerService: EmployerService,
  ) {}

  async getAllJobs() {
    return await this.jobsRepository.find({
      relations: {
        employer: true,
      },
    });
  }

  async getJob(id: number) {
    const job = await this.jobsRepository.findOneBy({
      id: id,
    });
    if (!job) throw new NotFoundException();
    return job;
  }

  async createJob(dto: CreateJobDto) {
    const employer = await this.employerService.getEmployer(dto.employerId);
    const job = this.jobsRepository.create(dto);
    job.employer = employer;
    await this.jobsRepository.save(job);
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
  }

  async deleteJob(id: number) {
    const job = await this.jobsRepository.findOne({ where: { id: id } });
    if (!job) throw new NotFoundException();
    await this.jobsRepository.remove(job);
  }
}
