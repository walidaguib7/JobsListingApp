import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { EmployerService } from 'src/employer/employer.service';
import { CachingService } from 'config/caching/caching.service';
import { PaginationDto } from './dtos/pagination.dto';
import { CreateReview } from './dtos/create.dto';
import { UpdateReview } from './dtos/update.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    private readonly usersService: UsersService,
    private readonly employerService: EmployerService,
    private readonly cachingService: CachingService,
  ) {}

  async getAll(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    const key = `reviews_${page}_${limit}`;
    const cachedReviews = await this.cachingService.getFromCache<Review[]>(key);
    if (cachedReviews) return cachedReviews;

    const reviews = await this.reviewsRepository.find({
      relations: {
        employer: true,
        user: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    await this.cachingService.setAsync(key, reviews);
    return reviews;
  }

  async getReview(id: number) {
    const key = `review_${id}`;
    const cachedReview = await this.cachingService.getFromCache<Review>(key);
    if (cachedReview) return cachedReview;
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: {
        employer: true,
        user: true,
      },
    });
    if (!review) throw new NotFoundException();
    await this.cachingService.setAsync(key, review);
    return review;
  }

  async createReview(dto: CreateReview) {
    const employer = await this.employerService.getEmployer(dto.employerId);
    const user = await this.usersService.findbyId(dto.userId);
    const review = this.reviewsRepository.create({
      content: dto.content,
      rating: dto.rating,
      employer: employer,
      user: user,
    });
    await this.reviewsRepository.save(review);
    await this.cachingService.removeByPattern('reviews');
    await this.cachingService.removeByPattern('review');
  }

  async updateReview(id: number, dto: UpdateReview) {
    const review = await this.reviewsRepository.findOneBy({ id });
    if (!review) return new NotFoundException();
    review.content = dto.content;
    review.rating = dto.rating;
    await this.reviewsRepository.save(review);
    await this.cachingService.removeByPattern('reviews');
    await this.cachingService.removeByPattern('review');
  }

  async deleteReview(id: number) {
    const review = await this.reviewsRepository.findOneBy({ id });
    if (!review) return new NotFoundException();
    await this.reviewsRepository.remove(review);
    await this.cachingService.removeByPattern('reviews');
    await this.cachingService.removeByPattern('review');
  }
}
