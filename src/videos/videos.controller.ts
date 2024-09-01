import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateVideoDto } from './dto/create-video.dto';
import { VideosService } from './videos.service';
import { ReactVideoDto } from './dto/react-video.dto';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Post(':id/react')
  async reactAVideo(
    @Request() req,
    @Body() reactVideoDto: ReactVideoDto,
    @Param('id') videoId: string,
  ) {
    const user = req.user;

    const res = await this.videosService.react(
      videoId,
      user._id,
      reactVideoDto.type,
    );
    return res;
  }

  @Get()
  findAll() {
    return this.videosService.findAll();
  }
}
