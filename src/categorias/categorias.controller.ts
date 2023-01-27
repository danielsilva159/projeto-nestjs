import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CriarCategoriaDTO } from './dtos/criar-categoria.dto';
import { Categoria } from './categoria.interface';
import { CategoriasService } from './categorias.service';
import { AtualizarCategoriaDTO } from './dtos/atualizar-categoria.dto';

@Controller('api/v1/categorias')
export class CategoriasController {
  constructor(private categoriasService: CategoriasService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarCategoria(
    @Body() criarCategoriaDTO: CriarCategoriaDTO,
  ): Promise<Categoria> {
    return await this.categoriasService.criarCategoria(criarCategoriaDTO);
  }

  @Get()
  async consultarCategorias(): Promise<Array<Categoria>> {
    return await this.categoriasService.consultarTodasCategorias();
  }

  @Get('/:categoria')
  async consultarCategoriaPeloId(
    @Param('categoria') categoria: string,
  ): Promise<Categoria> {
    return await this.categoriasService.consultarCategoriaPeloId(categoria);
  }

  @Put('/:categoria')
  @UsePipes(ValidationPipe)
  async atualizarCategoria(
    @Body() atualizarCategoriaDTO: AtualizarCategoriaDTO,
    @Param('categoria') categoria: string,
  ): Promise<void> {
    await this.categoriasService.atualizarCategoria(
      categoria,
      atualizarCategoriaDTO,
    );
  }
  @Post(':categoria/jogadores/:jogador')
  async atribuirCategoriaJogador(@Param() params: string[]): Promise<void> {
    return await this.categoriasService.atribuirCategoriaJogador(params);
  }
}
