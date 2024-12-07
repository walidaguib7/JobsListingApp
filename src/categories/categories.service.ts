import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { CachingService } from 'config/caching/caching.service';
import { CreateCategory } from './dtos/create.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly cachingService: CachingService,
  ) {}

  async getAll() {
    const key = 'categories';
    const cachedCategories =
      await this.cachingService.getFromCache<Category[]>(key);
    if (cachedCategories) return cachedCategories;

    const categories = await this.categoryRepository.find({
      relations: {
        jobs: true,
      },
    });
    await this.cachingService.setAsync(key, categories);
    return categories;
  }

  async getOne(id: number) {
    const category = await this.categoryRepository.findOneBy({
      id: id,
    });
    if (!category) throw new NotFoundException();
    return category;
  }

  async createOne(dto: CreateCategory) {
    const category = this.categoryRepository.create(dto);
    await this.categoryRepository.save(category);
    await this.cachingService.removeCaching('categories');
  }

  async updateOne(id: number, dto: CreateCategory) {
    const category = await this.categoryRepository.findOneBy({
      id: id,
    });
    if (!category) throw new NotFoundException();
    category.title = dto.title;
    await this.categoryRepository.save(category);
    await this.cachingService.removeCaching('categories');
  }

  async deleteOne(id: number) {
    const category = await this.categoryRepository.findOneBy({
      id: id,
    });
    if (!category) throw new NotFoundException();
    await this.categoryRepository.delete(category);
    await this.cachingService.removeCaching('categories');
  }
}
