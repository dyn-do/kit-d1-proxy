export interface D1Response {
    results: any[];
    success: boolean;
    error: string;
    message: string;

    // for local dev
    result?: D1Response[];
}