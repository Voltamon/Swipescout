export class Save {
  constructor(data = {}) {
    this.id = data.id || null;
    this.userId = data.userId || null;
    this.videoId = data.videoId || null;
    this.createdAt = data.createdAt || new Date();
  }

  static fromJSON(json) {
    return new Save(json);
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      videoId: this.videoId,
      createdAt: this.createdAt
    };
  }
}

