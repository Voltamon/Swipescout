export class UserVideo3 {
  constructor(data = {}) {
    this.id = data.id || null;
    this.userId = data.userId || null;
    this.videoUrl = data.videoUrl || "";
    this.thumbnailUrl = data.thumbnailUrl || "";
    this.title = data.title || "";
    this.description = data.description || "";
    this.duration = data.duration || 0;
    this.views = data.views || 0;
    this.likes = data.likes || 0;
    this.comments = data.comments || [];
    this.isPublic = data.isPublic || true;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.videoPosition = data.videoPosition || "intro"; // Replace 'intro' with a valid default value
  }

  static fromJSON(json) {
    return new UserVideo(json);
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      videoUrl: this.videoUrl,
      thumbnailUrl: this.thumbnailUrl,
      title: this.title,
      description: this.description,
      duration: this.duration,
      views: this.views,
      likes: this.likes,
      comments: this.comments,
      isPublic: this.isPublic,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      videoPosition: this.videoPosition
    };
  }
}
