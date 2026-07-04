import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User, IUser } from '../models';
import { AppError } from '../middleware/errorHandler';
import type { RegisterInput, LoginInput } from '../validators/authValidators';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Authentication service handling user registration, login,
 * token generation, and OAuth profile management.
 */
class AuthService {
  /**
   * Generate JWT access and refresh token pair.
   */
  generateTokens(user: IUser): AuthTokens {
    const payload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRY as any,
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRY as any,
    } as jwt.SignOptions);

    return { accessToken, refreshToken };
  }

  /**
   * Verify and decode a JWT token.
   */
  verifyToken(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  }

  /**
   * Register a new user with email and password.
   */
  async register(input: RegisterInput) {
    const existingUser = await User.findOne({ email: input.email });
    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    const user = await User.create({
      name: input.name,
      email: input.email,
      password: input.password,
      provider: 'local',
      role: 'author', // All registered users can write
    });

    const tokens = this.generateTokens(user);

    // Store refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return { user: user.toJSON(), ...tokens };
  }

  /**
   * Authenticate user with email and password.
   */
  async login(input: LoginInput) {
    const user = await User.findOne({ email: input.email }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    if (user.provider !== 'local') {
      throw new AppError(`Please sign in with ${user.provider}`, 401);
    }

    const isPasswordValid = await user.comparePassword(input.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const tokens = this.generateTokens(user);

    // Store refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return { user: user.toJSON(), ...tokens };
  }

  /**
   * Handle Google OAuth authentication.
   * Creates a new user or returns existing one.
   */
  async googleAuth(credential: string) {
    // Decode the Google JWT credential (ID token)
    const decoded = jwt.decode(credential) as {
      sub: string;
      email: string;
      name: string;
      picture: string;
    } | null;

    if (!decoded || !decoded.email) {
      throw new AppError('Invalid Google credential', 401);
    }

    let user = await User.findOne({
      $or: [
        { email: decoded.email },
        { provider: 'google', providerId: decoded.sub },
      ],
    });

    if (user) {
      // Update avatar if missing
      if (!user.avatar && decoded.picture) {
        user.avatar = decoded.picture;
        await user.save();
      }
    } else {
      // Create new user from Google profile
      user = await User.create({
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture || '',
        provider: 'google',
        providerId: decoded.sub,
        role: 'author',
      });
    }

    const tokens = this.generateTokens(user);

    user.refreshToken = tokens.refreshToken;
    await user.save();

    return { user: user.toJSON(), ...tokens };
  }

  /**
   * Refresh access token using a valid refresh token.
   */
  async refreshAccessToken(refreshToken: string) {
    const payload = this.verifyToken(refreshToken);

    const user = await User.findById(payload.userId).select('+refreshToken');
    if (!user || user.refreshToken !== refreshToken) {
      throw new AppError('Invalid refresh token', 401);
    }

    const tokens = this.generateTokens(user);

    user.refreshToken = tokens.refreshToken;
    await user.save();

    return tokens;
  }

  /**
   * Invalidate refresh token on logout.
   */
  async logout(userId: string) {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }

  /**
   * Get current user by ID.
   */
  async getCurrentUser(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }
}

export const authService = new AuthService();
