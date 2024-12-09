import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CachingService } from 'config/caching/caching.service';
import { Employer } from 'src/employer/employer.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { FollowDto } from './follow.dto';

@Injectable()
export class FollowingService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Employer)
    private readonly employerRepository: Repository<Employer>,
    private readonly cachingService: CachingService,
  ) {}

  async getCompanyFollowers(companyId: number) {
    const key = `followers_${companyId}`;
    const cachedFollowers = await this.cachingService.getFromCache<User[]>(key);
    if (cachedFollowers) return cachedFollowers;
    const company = await this.employerRepository.findOne({
      where: { id: companyId },
      relations: {
        followers: true,
      },
    });
    if (!company) throw new NotFoundException();
    const result = company.followers;
    await this.cachingService.setAsync(key, result);
    return result;
  }

  async getUserFollowedCompanies(userId: number) {
    const key = `following_${userId}`;
    const cachedFollowing =
      await this.cachingService.getFromCache<Employer[]>(key);
    if (cachedFollowing) return cachedFollowing;
    const result = await this.userRepository.findOne({
      where: { userId },
      relations: {
        followed_companies: true,
      },
    });
    if (!result) throw new NotFoundException();
    const companies = result.followed_companies;
    await this.cachingService.setAsync(key, companies);
    return companies;
  }

  async followCompany(dto: FollowDto) {
    const company = await this.employerRepository.findOne({
      where: { id: dto.companyId },
      relations: {
        followers: true,
      },
    });
    if (!company) throw new NotFoundException();
    const user = await this.userRepository.findOne({
      where: { userId: dto.userId },
      relations: {
        followed_companies: true,
      },
    });
    if (!user) throw new NotFoundException();

    user.followed_companies = [company];
    await this.userRepository.save(user);
    await this.cachingService.removeByPattern('followers');
    await this.cachingService.removeByPattern('following');
  }

  async unfollow(userId: number, companyId: number) {
    const company = await this.employerRepository.findOne({
      where: { id: companyId },
      relations: {
        followers: true,
      },
    });
    if (!company) throw new NotFoundException();
    const user = await this.userRepository.findOne({
      where: { userId: userId },
      relations: {
        followed_companies: true,
      },
    });
    if (!user) throw new NotFoundException();

    user.followed_companies = user.followed_companies.filter(
      (following) => following.id != companyId,
    );

    await this.userRepository.save(user);
    await this.cachingService.removeByPattern('followers');
    await this.cachingService.removeByPattern('following');
  }
}
