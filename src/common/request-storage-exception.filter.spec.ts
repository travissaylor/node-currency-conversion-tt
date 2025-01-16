import { RequestStorageExceptionFilter } from './request-storage-exception.filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

describe('RequestStorageExceptionFilter', () => {
  let filter: RequestStorageExceptionFilter;
  let mockDatabaseService: Partial<DatabaseService>;

  beforeEach(() => {
    mockDatabaseService = {
      request: {
        create: jest.fn(), // Mock only the `create` method
      } as unknown as Prisma.RequestDelegate<any>,
    };

    filter = new RequestStorageExceptionFilter(
      mockDatabaseService as DatabaseService,
    );
  });

  const createMockArgumentsHost = (
    requestMock: Partial<Request>,
    responseMock: Partial<Response>,
  ): ArgumentsHost => {
    return {
      switchToHttp: () => ({
        getRequest: () => requestMock,
        getResponse: () => responseMock,
      }),
    } as unknown as ArgumentsHost;
  };

  it('should store the exception details in the database and send the response', async () => {
    const requestMock = {
      path: '/test-path',
      query: { id: '123' },
    } as unknown as Request;

    const jsonMock = jest.fn();
    const responseMock = {
      status: jest.fn().mockReturnThis(),
      json: jsonMock,
    } as unknown as Response;

    const exception = new HttpException('Test exception', HttpStatus.BAD_REQUEST);

    const mockArgumentsHost = createMockArgumentsHost(requestMock, responseMock);

    await filter.catch(exception, mockArgumentsHost);

    // Verify database interaction
    expect(mockDatabaseService.request.create).toHaveBeenCalledWith({
      data: {
        path: '/test-path',
        parameters: JSON.stringify({ id: '123' }),
        body: JSON.stringify(exception.getResponse()),
      },
    });

    // Verify response handling
    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(responseMock.json).toHaveBeenCalledWith(exception.getResponse());
  });

  it('should handle non-HttpException gracefully', async () => {
    const requestMock = {
      path: '/test-path',
      query: {},
    } as unknown as Request;

    const jsonMock = jest.fn();
    const responseMock = {
      status: jest.fn().mockReturnThis(),
      json: jsonMock,
    } as unknown as Response;

    const exception = new Error('Unexpected error');

    const mockArgumentsHost = createMockArgumentsHost(requestMock, responseMock);

    await filter.catch(exception as any, mockArgumentsHost);

    // Verify database interaction
    expect(mockDatabaseService.request.create).toHaveBeenCalledWith({
      data: {
        path: '/test-path',
        parameters: '{}',
        body: JSON.stringify({
          statusCode: 500,
          message: 'Internal server error',
        }),
      },
    });

    // Verify response handling
    expect(responseMock.status).toHaveBeenCalledWith(500);
    expect(responseMock.json).toHaveBeenCalledWith({
      statusCode: 500,
      message: 'Internal server error',
    });
  });
});