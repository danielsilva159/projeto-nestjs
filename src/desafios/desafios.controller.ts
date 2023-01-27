import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { CriarDesafioDTO } from './dtos/criar-desafio.dto';

@Controller('api/v1/desafios')
export class DesafiosController {
  constructor(private readonly desafioService: DesafiosService) {}
  private readonly logger = new Logger(DesafiosController.name);
  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio(
    @Body() criarDesafioDTO: CriarDesafioDTO,
  ): Promise<Desafio> {
    this.logger.log(`criarDesatioDTO: ${JSON.stringify(criarDesafioDTO)}`);
    return await this.desafioService.criarDesafio(criarDesafioDTO);
  }

  @Get()
  async consultarDesafios() {}

  @Put('/:desafio')
  async atualizarDesafios() {}

  @Post('/:desafio/partida')
  async atribuirDasatioParida() {}
}
