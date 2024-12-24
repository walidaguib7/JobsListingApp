import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CachingModule } from 'config/caching/caching.module';
import { AuthModule } from 'src/auth/auth.module';
import { Category } from './category.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  const MockUsersService = {
    create: jest.fn((dto) => {
      return {
        title: 'walid',
        ...dto,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [CategoriesService, JwtService],
      imports: [
        TypeOrmModule.forFeature([Category]),
        AuthModule,
        CachingModule,
      ],
    })
      .overrideProvider(CategoriesService)
      .useValue(MockUsersService)
      .compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller.createOne({ title: 'walid' })).toHaveBeenCalled();
  });

  it('create should return created', async () => {});
});
