import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockDatabaseService: Partial<DatabaseService>;

  beforeEach(async () => {
    mockDatabaseService = {
      user: {
        findFirst: jest.fn(),
      } as unknown as Prisma.UserDelegate<Prisma.RejectOnNotFound>,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
  });

  const createMockExecutionContext = (headers: Record<string, string>) => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers,
        }),
      }),
    } as unknown as any;
  };

  it('should allow the request if the user exists', async () => {
    const mockContext = createMockExecutionContext({
      authorization: 'Bearer valid-user-id',
    });

    jest.spyOn(mockDatabaseService.user, 'findFirst').mockResolvedValueOnce({
      id: 'valid-user-id',
      email: 'test@test.com',
      name: 'Travis',
      updatedAt: new Date(),
      createdAt: new Date(),
    });

    const result = await guard.canActivate(mockContext);
    expect(result).toBe(true);
    expect(mockDatabaseService.user.findFirst).toHaveBeenCalledWith({
      where: { id: 'valid-user-id' },
    });
  });

  it('should throw UnauthorizedException if the Authorization header is missing', async () => {
    const mockContext = createMockExecutionContext({});

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if the Authorization header format is invalid', async () => {
    const mockContext = createMockExecutionContext({
      authorization: 'InvalidHeaderFormat',
    });

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if the token is invalid', async () => {
    const mockContext = createMockExecutionContext({
      authorization: 'Bearer invalid-user-id',
    });

    jest
      .spyOn(mockDatabaseService.user, 'findFirst')
      .mockResolvedValueOnce(null);

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(mockDatabaseService.user.findFirst).toHaveBeenCalledWith({
      where: { id: 'invalid-user-id' },
    });
  });
});
