import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [TasksModule, NotificationsModule, CommentsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
