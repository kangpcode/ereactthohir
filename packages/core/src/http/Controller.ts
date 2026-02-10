import { ApiResponseBuilder } from './ApiResponse';
import { Validator } from '../services/Validator';

export abstract class Controller {
    /**
     * Return a success response
     */
    protected success(data: any = null, message = 'Success', code = 200) {
        return ApiResponseBuilder.ok(data, message);
    }

    /**
     * Return a created response
     */
    protected created(data: any = null, message = 'Resource created') {
        return ApiResponseBuilder.created(data, message);
    }

    /**
     * Return an error response
     */
    protected error(message = 'Error', code = 400, errors: Record<string, string[]> = {}) {
        return new ApiResponseBuilder()
            .status(code)
            .message(message)
            .errors(errors)
            .error();
    }

    /**
     * Validate request data
     */
    protected validate(data: any, rules: Record<string, string>) {
        const result = Validator.validate(data, rules);
        if (!result.isValid) {
            throw new Error(JSON.stringify({
                message: 'Validation failed',
                errors: result.errors,
                is_validation_error: true
            }));
        }
        return data;
    }

    /**
     * Return a not found response
     */
    protected notFound(message = 'Resource not found') {
        return ApiResponseBuilder.notFound(message);
    }

    /**
     * Return an unauthorized response
     */
    protected unauthorized(message = 'Unauthorized') {
        return ApiResponseBuilder.unauthorized(message);
    }
}
