import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Video } from 'src/schemas/video.schema';
import { Model } from 'mongoose';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VideosService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<Video>,
    private readonly configService: ConfigService,
  ) {}
  async create(createVideoDto: CreateVideoDto, sharedBy: string) {
    const videoId = this.youtubeParser(createVideoDto.url);
    if (!videoId) {
      throw new BadRequestException('Invalid video url');
    }
    const videoData = await this.getVideoFromYoutube(videoId);
    if (!videoData) {
      throw new BadRequestException('Invalid video url');
    }

    const createVideo = new this.videoModel({
      title: videoData.snippet.title,
      description: videoData.snippet.description,
      thumbnail: videoData.snippet.thumbnails.default.url,
      url: createVideoDto.url,
      videoId: videoId,
      sharedBy: sharedBy,
    });
    return createVideo.save();
  }

  youtubeParser(url) {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length == 11 ? match[7] : false;
  }

  async getVideoFromYoutube(videoId: string) {
    const res = await axios.get(
      'https://youtube.googleapis.com/youtube/v3/videos',
      {
        params: {
          part: 'snippet',
          key: this.configService.get('YOUTUBE_API_KEY'),
          id: videoId,
        },
        headers: {
          Accept: 'application/json',
        },
      },
    );

    return res.data.items[0];
  }

  findAll() {
    return this.videoModel.find().exec();
  }

  async remove(id: string) {
    return this.videoModel.findByIdAndDelete(id);
  }
}
