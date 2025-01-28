import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaClient } from '@prisma/client';
import { parseISO } from 'date-fns';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class TasksService extends PrismaClient implements OnModuleInit {

  private  readonly logger = new Logger(TasksService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Tasks database service connected');
  }
  create(createTaskDto: CreateTaskDto) {
    const { deadline } = createTaskDto;
    return this.task.create({
      data: {
        ...createTaskDto,
        deadline: parseISO(deadline),
      },
    })
  }

  findAll() {
    return this.task.findMany({
      where: {
        available: true,
      }
    })
    // return `This action returns all tasks`;
  }

  async findOne(id: number) {
    const project = await this.task.findFirst({
      where: { id, available: true },
    });

    if (!project) {
      throw new RpcException({
        message: `Project with id ${id} not found`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return project;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const { id: __, deadline, ...data } = updateTaskDto;

    await this.findOne(id);
    const parsedDeadline = deadline ? parseISO(deadline) : undefined;

    return this.task.update({
      where: { id },
      data: {
        ...data,
        deadline: parsedDeadline,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.task.update({
      where: { id },
      data: {
        available: false,
      },
    });
  }
}
