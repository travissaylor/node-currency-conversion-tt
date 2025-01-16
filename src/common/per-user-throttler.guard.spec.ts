import { UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ThrottlerStorage } from '@nestjs/throttler';
import { PerUserThrottlerGuard } from './per-user-throttler.guard';
import { ThrottlerStorageRecord } from '@nestjs/throttler/dist/throttler-storage-record.interface';

class TestablePerUserThrottlerGuard extends PerUserThrottlerGuard {
  public async testGetTracker(req: Record<string, unknown>): Promise<string> {
    return this.getTracker(req);
  }
}

describe('PerUserThrottlerGuard', () => {
  let guard: TestablePerUserThrottlerGuard;

  const mockThrottlerStorage: ThrottlerStorage = {
    increment: jest.fn(
      async () => ({}) as unknown as Promise<ThrottlerStorageRecord>,
    ),
  };

  beforeEach(() => {
    guard = new TestablePerUserThrottlerGuard(
      {} as any, // Throttler options are not used in this guard
      mockThrottlerStorage,
      new Reflector(),
    );
  });

  const createMockRequest = (headers: Record<string, string>) => ({
    headers,
  });

  it('should return the token from a valid authorization header', async () => {
    const mockRequest = createMockRequest({
      authorization: 'Bearer valid-token',
    });

    const tracker = await guard.testGetTracker(mockRequest);
    expect(tracker).toBe('valid-token');
  });

  it('should throw UnauthorizedException if the authorization header is missing', async () => {
    const mockRequest = createMockRequest({});

    await expect(guard.testGetTracker(mockRequest)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if the authorization header format is invalid', async () => {
    const mockRequest = createMockRequest({
      authorization: 'InvalidHeaderFormat',
    });

    await expect(guard.testGetTracker(mockRequest)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if the authorization header type is not "Bearer"', async () => {
    const mockRequest = createMockRequest({
      authorization: 'Basic some-token',
    });

    await expect(guard.testGetTracker(mockRequest)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if the authorization header is missing the token', async () => {
    const mockRequest = createMockRequest({
      authorization: 'Bearer',
    });

    await expect(guard.testGetTracker(mockRequest)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
