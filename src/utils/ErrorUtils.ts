export class ErrorUtils {
    static stackTrace(error: unknown) {
        console.error(error);
        if (error instanceof Error) {
            return JSON.stringify(error, Object.getOwnPropertyNames(error))
        } else if (typeof error === 'string') {
            return error;
        } else {
            return "unexpected error";
        }
    }
}