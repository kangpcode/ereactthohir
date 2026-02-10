/**
 * API Response - Standardized API response format
 */

export interface ApiResponse<T = any> {
  success: boolean;
  code: number;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  meta?: {
    timestamp: number;
    path: string;
    version: string;
    pagination?: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
      from: number;
      to: number;
    };
  };
}

export class ApiResponseBuilder {
  private statusCode = 200;
  private responseMessage = 'Success';
  private responseData: any = null;
  private responseErrors: Record<string, string[]> = {};
  private path = '';
  private version = '1.0.0';

  status(code: number): this {
    this.statusCode = code;
    return this;
  }

  message(msg: string): this {
    this.responseMessage = msg;
    return this;
  }

  data<T>(data: T): ApiResponseBuilder {
    this.responseData = data;
    return this;
  }

  errors(errors: Record<string, string[]>): this {
    this.responseErrors = errors;
    return this;
  }

  meta(path: string, version: string): this {
    this.path = path;
    this.version = version;
    return this;
  }

  success(): ApiResponse {
    return {
      success: true,
      code: this.statusCode,
      message: this.responseMessage,
      data: this.responseData,
      meta: {
        timestamp: Date.now(),
        path: this.path,
        version: this.version,
      },
    };
  }

  error(): ApiResponse {
    return {
      success: false,
      code: this.statusCode,
      message: this.responseMessage,
      errors: this.responseErrors,
      meta: {
        timestamp: Date.now(),
        path: this.path,
        version: this.version,
      },
    };
  }

  static ok<T>(data?: T, message = 'Success'): ApiResponse<T> {
    return {
      success: true,
      code: 200,
      message,
      data,
      meta: {
        timestamp: Date.now(),
        path: '',
        version: '1.0.0',
      },
    };
  }

  static created<T>(data?: T, message = 'Resource created'): ApiResponse<T> {
    return {
      success: true,
      code: 201,
      message,
      data,
      meta: {
        timestamp: Date.now(),
        path: '',
        version: '1.0.0',
      },
    };
  }

  static badRequest(errors: Record<string, string[]>, message = 'Validation failed'): ApiResponse {
    return {
      success: false,
      code: 400,
      message,
      errors,
      meta: {
        timestamp: Date.now(),
        path: '',
        version: '1.0.0',
      },
    };
  }

  static unauthorized(message = 'Unauthorized'): ApiResponse {
    return {
      success: false,
      code: 401,
      message,
      meta: {
        timestamp: Date.now(),
        path: '',
        version: '1.0.0',
      },
    };
  }

  static forbidden(message = 'Forbidden'): ApiResponse {
    return {
      success: false,
      code: 403,
      message,
      meta: {
        timestamp: Date.now(),
        path: '',
        version: '1.0.0',
      },
    };
  }

  static notFound(message = 'Resource not found'): ApiResponse {
    return {
      success: false,
      code: 404,
      message,
      meta: {
        timestamp: Date.now(),
        path: '',
        version: '1.0.0',
      },
    };
  }

  static serverError(message = 'Internal server error'): ApiResponse {
    return {
      success: false,
      code: 500,
      message,
      meta: {
        timestamp: Date.now(),
        path: '',
        version: '1.4.0',
      },
    };
  }

  static paginate<T>(data: T[], total: number, perPage: number, currentPage: number): ApiResponse<T[]> {
    const lastPage = Math.ceil(total / perPage);
    return {
      success: true,
      code: 200,
      message: 'Resources retrieved successfully',
      data,
      meta: {
        timestamp: Date.now(),
        path: '',
        version: '1.4.0',
        pagination: {
          total,
          per_page: perPage,
          current_page: currentPage,
          last_page: lastPage,
          from: (currentPage - 1) * perPage + 1,
          to: Math.min(currentPage * perPage, total)
        }
      },
    };
  }
}
