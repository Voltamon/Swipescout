export class Comment {
  constructor(data = {}) {
    this.id = data.id || null;
    this.userId = data.userId || null;
    this.videoId = data.videoId || null;
    this.content = data.content || '';
    this.parentId = data.parentId || null; // For replies
    this.likes = data.likes || 0;
    this.replies = data.replies || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static fromJSON(json) {
    return new Comment(json);
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      videoId: this.videoId,
      content: this.content,
      parentId: this.parentId,
      likes: this.likes,
      replies: this.replies,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

