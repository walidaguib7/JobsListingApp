import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employer } from './employer.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CreateEmployerDto } from './dtos/create.dto';
import { UpdateEmployerDto } from './dtos/update.dto';

@Injectable()
export class EmployerService {
  constructor(
    @InjectRepository(Employer)
    private readonly employerRepository: Repository<Employer>,
    private readonly userService: UsersService,
  ) {}

  async getEmployer(id: number) {
    const employer = await this.employerRepository.findOneBy({
      id: id,
    });
    if (!employer) throw new NotFoundException();
    return employer;
  }

  async createEmployer(dto: CreateEmployerDto) {
    const user = await this.userService.findbyId(dto.userId);
    const employer = this.employerRepository.create(dto);
    employer.user = user;
    await this.employerRepository.save(employer);
  }

  async updateEmployer(id: number, dto: UpdateEmployerDto) {
    const employer = await this.getEmployer(id);
    employer.CompanyName = dto.CompanyName;
    employer.Company_Description = dto.Company_Description;
    employer.Country = dto.Country;
    employer.city = dto.city;
    employer.zipCode = dto.zipCode;
    employer.website = dto.website;
    await this.employerRepository.save(employer);
  }

  async deleteEmployer(id: number) {
    const employer = await this.getEmployer(id);
    await this.employerRepository.remove(employer);
  }
}
