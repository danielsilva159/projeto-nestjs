import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CriarCategoriaDTO } from './dtos/criar-categoria.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categoria } from './categoria.interface';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
  ) {}

  async criarCategoria(criarCategoria: CriarCategoriaDTO): Promise<Categoria> {
    const { categoria } = criarCategoria;
    const categoriaEncotrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();
    if (categoriaEncotrada) {
      throw new BadRequestException(`Categoria ${categoria} ja cadastrada!`);
    }

    const categoriaCriada = new this.categoriaModel(criarCategoria);
    return await categoriaCriada.save();
  }

  async consultarTodasCategorias(): Promise<Array<Categoria>> {
    return await this.categoriaModel.find().exec();
  }

  async consultarCategoriaPeloId(categoria: string): Promise<Categoria> {
    const categoriaEncotrada = await this.categoriaModel
      .findById({ categoria })
      .exec();
    if (!categoriaEncotrada) {
      throw new NotFoundException(`Categoria ${categoria} não encontrada`);
    }

    return categoriaEncotrada;
  }
}
