import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import * as uuid from 'uuid';
import { Model } from 'mongoose';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';

@Injectable()
export class JogadoresService {
  private readonly logger = new Logger(JogadoresService.name);

  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}
  async criarJogador(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const { email } = criarJogadorDto;
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();
    if (jogadorEncontrado) {
      throw new BadRequestException(
        `Jogador com e-mail ${email} ja cadastrado`,
      );
    }
    const jogadorCriado = new this.jogadorModel(criarJogadorDto);
    return await jogadorCriado.save();
  }

  async atualizarJogador(
    _id: string,
    atualizarJogadorDto: AtualizarJogadorDto,
  ): Promise<void> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();
    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com o id ${_id} não encontrado`);
    }
    await this.jogadorModel
      .findByIdAndUpdate({ _id }, { $set: atualizarJogadorDto })
      .exec();
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return await this.jogadorModel.find().exec();
  }

  async consultarJogadorPeloId(_id: string): Promise<Jogador> {
    const jogadorEncotrado = await this.jogadorModel.findById({ _id }).exec();
    console.log(jogadorEncotrado);

    if (!jogadorEncotrado) {
      throw new NotFoundException(`Jogador com id ${_id} não encotrado`);
    }
    return jogadorEncotrado;
  }

  async deletarJogador(_id: string): Promise<any> {
    const jogadorEncotrado = await this.jogadorModel.findOne({ _id }).exec();
    if (!jogadorEncotrado) {
      throw new NotFoundException(`Jogador com id ${_id} não encotrado`);
    }
    return await this.jogadorModel.deleteOne({ _id }).exec();
  }
}
