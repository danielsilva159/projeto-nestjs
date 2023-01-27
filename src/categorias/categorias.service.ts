import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CriarCategoriaDTO } from './dtos/criar-categoria.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categoria } from './categoria.interface';
import { AtualizarCategoriaDTO } from './dtos/atualizar-categoria.dto';
import { JogadoresService } from 'src/jogadores/jogadores.service';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    private readonly jogadoresService: JogadoresService,
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
    return await this.categoriaModel.find().populate('jogadores').exec();
  }

  async consultarCategoriaPeloId(categoria: string): Promise<Categoria> {
    const categoriaEncotrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();
    if (!categoriaEncotrada) {
      throw new NotFoundException(`Categoria ${categoria} não encontrada`);
    }

    return categoriaEncotrada;
  }

  async atualizarCategoria(
    categoria: string,
    atualizarCategoriaDTO: AtualizarCategoriaDTO,
  ): Promise<void> {
    const categoriaEncotrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();
    if (!categoriaEncotrada) {
      throw new NotFoundException(`Categoria ${categoria} não encontrada`);
    }

    await this.categoriaModel
      .findOneAndUpdate({ categoria }, { $set: atualizarCategoriaDTO })
      .exec();
  }

  async atribuirCategoriaJogador(params: string[]): Promise<void> {
    const categoria = params['categoria'];
    const idJogador = params['jogador'];

    const categoriaEncotrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    const jogadorCadastradoCategoria = await this.categoriaModel
      .find({ categoria })
      .where('jogadores')
      .in(idJogador)
      .exec();
    await this.jogadoresService.consultarJogadorPeloId(idJogador);
    if (!categoriaEncotrada) {
      throw new BadRequestException(
        `Categoria ${categoriaEncotrada} não cadastrada`,
      );
    }

    if (jogadorCadastradoCategoria.length > 0) {
      throw new BadRequestException(
        `Jogador ${idJogador} ja cadastrado na categoria ${categoria}`,
      );
    }
    categoriaEncotrada.jogadores.push(idJogador);
    await this.categoriaModel.findOneAndUpdate(
      { categoria },
      { $set: categoriaEncotrada },
    );
  }
}
