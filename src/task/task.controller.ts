import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { NewTaskDto } from './dto/new-task.dto';
import { TaskService } from './task.service';
import { TaskReadEntity } from './entities/task-read.entity';
import { NewCheckPointDto } from './dto/new-check-point.dto';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  @HttpCode(201)
  create(@Body() newTask: NewTaskDto) {
    return this.taskService.create(newTask);
  }

  @Put('/:taskId/complete')
  @HttpCode(204)
  makeComplete(@Param('taskId') taskId: number) {
    return this.taskService.makeComplete(taskId);
  }

  @Get()
  findAll(
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ): Promise<TaskReadEntity[]> {
    return this.taskService.findAll(offset, limit);
  }

  @Get('/day/:day')
  findPaginateByDay(
    @Param('day') day: string,
    @Query('offset')
    offset: number,
    @Query('limit') limit: number,
  ): Promise<TaskReadEntity[]> {
    return this.taskService.findPaginateByDay(day, offset, limit);
  }

  @Post('/:taskId/check-points')
  @HttpCode(201)
  setCheckPoint(
    @Param('taskId') taskId: number,
    @Body() newCheckPointDto: NewCheckPointDto,
  ) {
    newCheckPointDto.taskId = taskId;
    return this.taskService.setCheckPoint(newCheckPointDto);
  }

  @Get('/resumes/day/:day')
  getResumeByDay(@Param('day') day: string): Promise<any[]> {
    return this.taskService.getResumeByDay(day);
  }
}
