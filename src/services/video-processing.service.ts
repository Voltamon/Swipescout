// video-processing.service.ts
import { Injectable } from "@nestjs/common"; // Or your preferred dependency injection framework
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserVideo } from "../entities/user-video.entity";
import { Like } from "../entities/like.entity";
import { Save } from "../entities/save.entity";
import { Comment } from "../entities/comment.entity";
import { User } from "../entities/user.entity";

@Injectable()
export class VideoProcessingService {
  constructor(
    @InjectRepository(UserVideo)
    private readonly userVideoRepository: Repository<UserVideo>,
    @InjectRepository(Like) private readonly likeRepository: Repository<Like>,
    @InjectRepository(Save) private readonly saveRepository: Repository<Save>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async likeVideo(userId: string, videoId: string): Promise<boolean> {
    const existingLike = await this.likeRepository.findOne({
      where: { userId, videoId },
    });

    if (existingLike) {
      // Unlike
      await this.likeRepository.delete(existingLike.id);
      return false; // Indicate unliked
    } else {
      // Like
      const newLike = this.likeRepository.create({ userId, videoId });
      await this.likeRepository.save(newLike);
      return true; // Indicate liked
    }
  }

  async saveVideo(userId: string, videoId: string): Promise<boolean> {
    const existingSave = await this.saveRepository.findOne({
      where: { userId, videoId },
    });

    if (existingSave) {
      // Unsave
      await this.saveRepository.delete(existingSave.id);
      return false; // Indicate unsaved
    } else {
      // Save
      const newSave = this.saveRepository.create({ userId, videoId });
      await this.saveRepository.save(newSave);
      return true; // Indicate saved
    }
  }

  async addComment(
    userId: string,
    videoId: string,
    commentText: string
  ): Promise<Comment> {
    const newComment = this.commentRepository.create({
      videoId,
      userId,
      text: commentText,
    });
    return await this.commentRepository.save(newComment);
  }

  async getComments(
    videoId: string,
    limit: number,
    offset: number
  ): Promise<{ comments: Comment[]; total: number }> {
    const [comments, total] = await this.commentRepository.findAndCount({
      where: { videoId },
      take: limit,
      skip: offset,
      order: { createdAt: "DESC" }, // Newest first
      relations: ["user"], // Eager load the user for each comment
    });

    return { comments, total };
  }

  async searchVideos(
    query: string
  ): Promise<{ videos: UserVideo[]; total: number }> {
    const [videos, total] = await this.userVideoRepository.findAndCount({
      where: [
        { video_title: Like("%" + query + "%") }, // Use TypeORM's Like operator
        { hashtags: Like("%" + query + "%") },
      ],
      take: 20, // Adjust as needed
      skip: 0,
      order: { submitted_at: "DESC" },
    });

    return { videos, total };
  }

  async saveVideoInfo(
    userId: string,
    jobId: string | null,
    videoUrl: string,
    title: string,
    videoPosition: string,
    videoType: string,
    hashtags: string[],
    duration: number,
    status: string
  ): Promise<UserVideo> {
    const newVideo = this.userVideoRepository.create({
      user_id: userId,
      job_id: jobId,
      video_url: videoUrl,
      video_title: title,
      video_position: videoPosition,
      video_type: videoType,
      hashtags: hashtags,
      video_duration: duration,
      status: status,
    });

    return await this.userVideoRepository.save(newVideo);
  }

  async getUserVideos(
    userId: string,
    limit: number,
    offset: number
  ): Promise<{ videos: UserVideo[]; total: number }> {
    const [videos, total] = await this.userVideoRepository.findAndCount({
      where: { user_id: userId },
      take: limit,
      skip: offset,
      order: { submitted_at: "DESC" },
    });

    return { videos, total };
  }

  async getVideoById(
    id: string,
    userId: string
  ): Promise<UserVideo | undefined> {
    return await this.userVideoRepository.findOne({
      where: { id, user_id: userId },
    });
  }

  async updateVideo(
    id: string,
    userId: string,
    updates: Partial<UserVideo>
  ): Promise<UserVideo> {
    await this.userVideoRepository.update(id, { ...updates, user_id: userId });
    return await this.userVideoRepository.findOne({ where: { id } });
  }

  async deleteVideo(id: string, userId: string): Promise<void> {
    await this.userVideoRepository.delete({ id, user_id: userId });
  }

  async getVideosByJobId(
    jobId: string,
    limit: number,
    offset: number
  ): Promise<{ videos: UserVideo[]; total: number }> {
    const [videos, total] = await this.userVideoRepository.findAndCount({
      where: { job_id: jobId },
      take: limit,
      skip: offset,
      order: { submitted_at: "DESC" },
    });

    return { videos, total };
  }

  async getAllVideos(
    limit: number,
    offset: number
  ): Promise<{ videos: UserVideo[]; total: number }> {
    const [videos, total] = await this.userVideoRepository.findAndCount({
      take: limit,
      skip: offset,
      order: { submitted_at: "DESC" },
    });

    return { videos, total };
  }

  async getJobseekersVideos(
    limit: number,
    offset: number
  ): Promise<{ videos: UserVideo[]; total: number }> {
    const [videos, total] = await this.userVideoRepository.findAndCount({
      where: { video_type: "jobseeker" },
      take: limit,
      skip: offset,
      order: { submitted_at: "DESC" },
    });

    return { videos, total };
  }

  async getEmployersVideos(
    limit: number,
    offset: number
  ): Promise<{ videos: UserVideo[]; total: number }> {
    const [videos, total] = await this.userVideoRepository.findAndCount({
      where: { video_type: "employer" },
      take: limit,
      skip: offset,
      order: { submitted_at: "DESC" },
    });

    return { videos, total };
  }
}
