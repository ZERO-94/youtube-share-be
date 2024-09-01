import { IsEnum, IsNotEmpty } from 'class-validator';

export class ReactVideoDto {
  @IsNotEmpty()
  @IsEnum(['like', 'dislike'])
  type: string;
}
