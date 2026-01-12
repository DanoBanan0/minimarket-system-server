import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto) {
    if (!createProductDto.slug) {
      createProductDto.slug = createProductDto.name
        .toLowerCase()
        .replaceAll(' ', '-')
        .replaceAll("'", '');
    }
    const existingProduct = await this.productRepository.findOneBy({
      slug: createProductDto.slug
    });

    if (existingProduct) {
      throw new BadRequestException(`Product with name "${createProductDto.name}" already exists`);
    }

    const product = this.productRepository.create(createProductDto);
    await this.productRepository.save(product);
    return product;

  }

  findAll() {
    return this.productRepository.find({
      order: { name: 'ASC' }
    });
  }

  async findOne(term: string) {
    let product: Product | null;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('UPPER(name) =:name or slug =:slug', {
          name: term.toUpperCase(),
          slug: term.toLowerCase(),
        }).getOne();
    }

    if (!product)
      throw new NotFoundException(`Product with term ${term} not found`);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    });

    if (!product) {
      throw new NotFoundException(`Product with id: ${id} not found`);
    }
    await this.productRepository.save(product);
    return product;
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return { message: 'Product deleted sucessfully' }
  }
}
