import { IsString, IsCurrency } from 'class-validator';

export class ConversionDto {
  @IsString()
  from: string;

  @IsString()
  to: string;

  @IsCurrency()
  amount: number;
}
