export class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.email = data.email || '';
    this.username = data.username || '';
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.avatar = data.avatar || '';
    this.bio = data.bio || '';
    this.role = data.role || 'jobseeker'; // jobseeker, employer, admin
    this.isVerified = data.isVerified || false;
    this.isActive = data.isActive || true;
    this.lastLogin = data.lastLogin || null;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static fromJSON(json) {
    return new User(json);
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      avatar: this.avatar,
      bio: this.bio,
      role: this.role,
      isVerified: this.isVerified,
      isActive: this.isActive,
      lastLogin: this.lastLogin,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  get displayName() {
    return this.fullName || this.username || this.email;
  }
}

