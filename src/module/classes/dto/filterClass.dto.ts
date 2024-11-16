import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class FilterClassDto {
  @ApiPropertyOptional()
  @IsOptional()
  page: number;
  @ApiPropertyOptional()
  @IsOptional()
  pageSize: number;
  @ApiPropertyOptional()
  @IsOptional()
  keyword: string
  @ApiPropertyOptional()
  @IsOptional()
  userId: number
}

