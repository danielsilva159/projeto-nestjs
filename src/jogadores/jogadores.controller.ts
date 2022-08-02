import { Controller, Post } from '@nestjs/common';

@Controller('api/vi/jogadores')
export class JogadoresController {
  @Post()
  async criarAtualizarJogador() {}
}
