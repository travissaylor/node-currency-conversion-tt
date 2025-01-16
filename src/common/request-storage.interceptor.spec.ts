import { RequestStorageInterceptor } from './request-storage.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { DatabaseService } from 'src/database/database.service';

describe('RequestStorageInterceptor', () => {
  let interceptor: RequestStorageInterceptor<any>;
  let mockDatabaseService: Partial<DatabaseService>;

  beforeEach(() => {
    mockDatabaseService = {
      request: {
        create: jest.fn(), // Mock the `create` method
      } as any,
    };

    interceptor = new RequestStorageInterceptor(
      mockDatabaseService as DatabaseService,
    );
  });

  const createMockExecutionContext = (
    req: Partial<Request>,
  ): ExecutionContext =>
    ({
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(req),
      }),
    }) as unknown as ExecutionContext;

  it('should store the response in the database', async () => {
    const mockRequest = {
      path: '/test-path',
      query: { id: '123' },
    } as Partial<Request>;

    const mockContext = createMockExecutionContext(mockRequest);
    const mockCallHandler: CallHandler = {
      handle: jest.fn(() => of({ success: true })),
    };

    await interceptor.intercept(mockContext, mockCallHandler).toPromise();

    // Verify database interaction
    expect(mockDatabaseService.request.create).toHaveBeenCalledWith({
      data: {
        path: '/test-path',
        parameters: JSON.stringify({ id: '123' }),
        body: JSON.stringify({ success: true }),
      },
    });

    // Verify next.handle was called
    expect(mockCallHandler.handle).toHaveBeenCalled();
  });
});
