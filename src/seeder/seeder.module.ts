import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { UserSeederService } from './user-seeder.command';
import { UsersModule } from 'src/users/users.module';
import { VideosModule } from 'src/videos/videos.module';
import { VideoSeederService } from './video-seeder.command';

@Module({
  imports: [CommandModule, UsersModule, VideosModule],
  providers: [UserSeederService, VideoSeederService],
  exports: [UserSeederService, VideoSeederService],
})
export class SeederModule {}
