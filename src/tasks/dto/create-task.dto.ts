import { IsDateString, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {

  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsString()
  @IsNotEmpty()
  public description: string;

  @IsString()
  @IsNotEmpty()
  @IsDateString()
  public deadline: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsIn(['to_do', 'in_progress', 'completed'])
  public status?: string;

  @IsNumber()
  @IsNotEmpty()
  public projectId: number;

  @IsNumber()
  @IsOptional()
  public assignedTo: number;

}
