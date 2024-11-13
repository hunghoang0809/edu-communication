import { PartialType } from '@nestjs/mapped-types';
import { CreateClassDto } from './createClass.dto';

export class UpdateClassDto extends PartialType(CreateClassDto) {}
