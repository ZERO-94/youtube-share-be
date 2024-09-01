import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { VideosService } from './videos.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('videos')
@UseGuards(JwtAuthGuard)
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  async create(@Request() req, @Body() createVideoDto: CreateVideoDto) {
    const user = req.user;
    try {
      const res = await this.videosService.create(createVideoDto, user._id);
      return res;
    } catch (e) {
      if (e.code === 11000) {
        throw new BadRequestException('Video already exists');
      }
      throw e;
    }
  }

  @Get()
  findAll() {
    return this.videosService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videosService.remove(id);
  }
}
