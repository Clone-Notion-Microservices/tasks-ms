import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaClient } from '@prisma/client';
import { parseISO } from 'date-fns';
import { RpcException } from '@nestjs/microservices';
import { PaginationDto } from '../common';

@Injectable()
export class TasksService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(TasksService.name);

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
    });
  }

  async findAll(queryDto: PaginationDto) {
    const { page, limit, query, projectId } = queryDto;
    const total = await this.task.count({
      where: {
        available: true,
        ...(projectId ? { taskId: Number(projectId) } : {}), // Solo agrega taskId si está definido
        AND: query
          ? [
              { title: { contains: query } },
              { description: { contains: query } },
              { status: { contains: query } },
            ]
          : undefined, // Si query está vacío, no aplica el filtro
      },
    });

    const lastPage = Math.ceil(total / limit!);

    const result = await this.task.findMany({
      skip: (page - 1) * limit!,
      take: limit,
      where: {
        available: true,
        ...(projectId ? { taskId: Number(projectId) } : {}),
        OR: query
          ? [
              { title: { contains: query } },
              { description: { contains: query } },
              { status: { contains: query } },
            ]
          : undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return { data: result, meta: { page, total, lastPage } };
  }

  async findOne(id: number) {
    const task = await this.task.findFirst({
      where: { id, available: true },
    });

    if (!task) {
      throw new RpcException({
        message: `Task with id ${id} not found`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return task;
  }

  async findOneByUser(id: number) {
    const taskStatus = await this.task.groupBy({
      by: ['status'],
      where: { assignedTo: id, available: true },
      _count: {
        status: true, // Contar las tareas por cada estado
      },
    });

    // Transforma el resultado en un objeto con { "pending": 4, "completed": 3 }
    const organizedTaskCounts = taskStatus.reduce(
      (acc, task) => {
        acc[task.status] = task._count.status;
        return acc;
      },
      {} as Record<string, number>,
    );

    if (!organizedTaskCounts) {
      throw new RpcException({
        message: `Task with id ${id} not found`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return organizedTaskCounts;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const { deadline, ...data } = updateTaskDto;

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
