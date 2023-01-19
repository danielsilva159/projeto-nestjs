import { IsNotEmpty } from 'class-validator';

export class AtualizarJogadorDto {
  @IsNotEmpty({})
  readonly telefoneCelular: string;

  @IsNotEmpty({ message: 'Nome em branco' })
  readonly nome: string;
}
