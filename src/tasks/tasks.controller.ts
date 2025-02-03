import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from '../common';

@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @MessagePattern('createTask')
  create(@Payload() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @MessagePattern('findAllTasks')
  findAll(queryDto: PaginationDto) {
    return this.tasksService.findAll(queryDto);
  }

  @MessagePattern('findOneTask')
  findOne(@Payload() id: number) {
    return this.tasksService.findOne(id);
  }

  @MessagePattern('findOneByUser')
  findOneByUser(@Payload() id: number) {
    return this.tasksService.findOneByUser(id);
  }

  @MessagePattern('updateTask')
  update(@Payload() UpdateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(UpdateTaskDto.id, UpdateTaskDto);
  }

  @MessagePattern('removeTask')
  remove(@Payload() id: number) {
    return this.tasksService.remove(id);
  }
}
