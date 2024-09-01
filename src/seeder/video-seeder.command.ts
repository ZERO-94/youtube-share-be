import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Command } from 'nestjs-command';
import { VideosService } from 'src/videos/videos.service';

@Injectable()
export class VideoSeederService {
  constructor(
    private readonly videoService: VideosService,
    private readonly configService: ConfigService,
  ) {}

  @Command({
    command: 'create:video',
    describe: 'create a video',
  })
  async create() {
    const video = await this.videoService.create(
      {
        url: 'https://youtu.be/qOzroW_UaJM',
      },
      '60b8e',
    );
    console.log(video);
  }
}
