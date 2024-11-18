import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class FilterUserDto {
 @ApiPropertyOptional()
 @IsOptional()
  page: number;
 @ApiPropertyOptional()
 @IsOptional()
  pageSize: number;
 @ApiPropertyOptional()
 @IsOptional()
  keyword: string;
 @ApiPropertyOptional()
 @IsOptional()
  role: string;
  @ApiPropertyOptional()
  @IsOptional()
 isAddClass: boolean;

  @ApiPropertyOptional()
  @IsOptional()
 subjectId: number;
}

