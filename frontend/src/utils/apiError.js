export function getApiError(error) {
    return {
        status: error.response?.status ?? null,
        message:
            error.response?.data?.message ??
            "Unable to connect to the server.",
        details: error.response?.data?.details ?? null,
    };
}