import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
