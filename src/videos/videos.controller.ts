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
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateVideoDto } from './dto/create-video.dto';
import { VideosService } from './videos.service';
import { ReactVideoDto } from './dto/react-video.dto';
import { AuthGuard } from '@nestjs/passport';
import { OptionalJwtAuthGuard } from 'src/guards/optional-jwt-auth.guard';
import { SocketService } from 'src/socket/socket/socket.service';

@Controller('videos')
export class VideosController {
  constructor(
    private readonly videosService: VideosService,
    private readonly socketService: SocketService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createVideoDto: CreateVideoDto) {
    const user = req.user;
    try {
      const res = await this.videosService.create(createVideoDto, user._id);
      this.socketService.sendMessageToAll('new-video', {
        message: 'New video is shared!',
        videoData: res,
      });
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

  @UseGuards(JwtAuthGuard)
  @Delete(':id/react')
  async deleteReactAVideo(@Request() req, @Param('id') videoId: string) {
    const user = req.user;

    const res = await this.videosService.deleteReaction(videoId, user._id);

    return res;
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.videosService.findAll(req?.user?._id);
  }
}
