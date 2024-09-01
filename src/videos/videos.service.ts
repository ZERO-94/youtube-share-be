import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Video } from 'src/schemas/video.schema';
import { Model, Types } from 'mongoose';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { SocketService } from 'src/socket/socket/socket.service';

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

  async findAll(reactUserId?: string) {
    const objectIdUser = reactUserId ? new Types.ObjectId(reactUserId) : null;

    const videos = await this.videoModel
      .aggregate([
        {
          $lookup: {
            from: 'users', // Name of the User collection
            localField: 'sharedBy',
            foreignField: '_id',
            as: 'sharedBy',
          },
        },
        { $unwind: '$sharedBy' },
        {
          $addFields: {
            reactions: { $ifNull: ['$reactions', []] }, // Ensure reactions is an array
            totalLikes: {
              $size: {
                $filter: {
                  input: { $ifNull: ['$reactions', []] }, // Ensure input is an array
                  as: 'reaction',
                  cond: { $eq: ['$$reaction.type', 'like'] },
                },
              },
            },
            totalDislikes: {
              $size: {
                $filter: {
                  input: { $ifNull: ['$reactions', []] }, // Ensure input is an array
                  as: 'reaction',
                  cond: { $eq: ['$$reaction.type', 'dislike'] },
                },
              },
            },
            userReaction: objectIdUser
              ? {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: { $ifNull: ['$reactions', []] },
                        as: 'reaction',
                        cond: { $eq: ['$$reaction.reactedBy', objectIdUser] },
                      },
                    },
                    0,
                  ],
                }
              : null,
          },
        },
        {
          $project: {
            videoId: 1,
            title: 1,
            description: 1,
            thumbnail: 1,
            url: 1,
            sharedBy: {
              _id: 1,
              username: 1,
              email: 1,
              // other User fields you want to project
            },
            totalLikes: 1,
            totalDislikes: 1,
            userReacted: {
              $cond: {
                if: { $ne: ['$userReaction', null] },
                then: true,
                else: false,
              },
            },
            userReactionType: { $ifNull: ['$userReaction.type', null] },
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ])
      .sort({ createdAt: -1 })
      .exec();

    return videos;
  }

  async react(videoId: string, userId: string, reaction: string) {
    const video = await this.videoModel.findOne({ videoId: videoId });
    if (!video) {
      throw new BadRequestException('Video not found');
    }

    const reactedBy = video.reactions.find(
      (reaction) => reaction.reactedBy.toString() === userId,
    );
    if (reactedBy) {
      reactedBy.type = reaction;
    } else {
      video.reactions.push({
        type: reaction,
        //@ts-ignore
        reactedBy: userId,
      });
    }

    return video.save();
  }

  async deleteReaction(videoId: string, userId: string) {
    const video = await this.videoModel.findOne({ videoId: videoId });
    if (!video) {
      throw new BadRequestException('Video not found');
    }

    const reactedBy = video.reactions.find(
      (reaction) => reaction.reactedBy.toString() === userId,
    );
    if (!reactedBy) {
      throw new BadRequestException('Reaction not found');
    }

    video.reactions = video.reactions.filter(
      (reaction) => reaction.reactedBy.toString() !== userId,
    );

    return video.save();
  }
}
