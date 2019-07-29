/* eslint @typescript-eslint/camelcase: 0 */
import { AuthenticatedUserDto } from './../components/Auth/dto/authenticated.user.dto';
import { UserRole } from './../proto';
import { User } from '../Repositories/user.entity';
import { AppMailerService } from './../components/AppMailer/appMailer.service';
import { Repository, UpdateResult } from 'typeorm';
import { Client } from 'pg';

export const mailSentSuccess = {
  success: true,
};

export const mockUser = {
  name: 'Jason Carty',
  email: 'lkhasdf@kajhsdf.com',
  password: '',
  confirmed: true,
  verification_token: null,
  password_reset_token: null,
  id: 1,
  confirmed_at: null,
  verification_sent_at: null,
  password_reset_token_sent_at: null,
  role: UserRole.USER,
  created_at: null,
  updated_at: null,
};

export const adminUser = Promise.resolve({
  ...mockUser,
  role: UserRole.ADMIN,
} as unknown) as Promise<User>;

export const authenticatedUser = Promise.resolve({
  user: { ...mockUser },
  token: '98a7sdf987sf',
}) as Promise<AuthenticatedUserDto>;

export const appMailer = ({
  newUserMail: (): {} => mailSentSuccess,
} as unknown) as AppMailerService;

export const mockClient = ({
  connect: jest.fn(),
  query: jest.fn(),
  end: jest.fn(),
} as unknown) as Client;

export const singleUser = Promise.resolve({
  ...mockUser,
}) as Promise<User>;

export const allUsers = Promise.resolve([mockUser]) as Promise<User[]>;

export const updatedUser = (Promise.resolve({
  ...mockUser,
}) as unknown) as Promise<UpdateResult>;

export const repositoryMock = ({
  create: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
} as unknown) as Repository<User>;
