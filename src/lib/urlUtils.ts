/**
 * Converts a full public URL to a "clean" version for database storage
 * by removing the "/assets" path segment.
 * e.g., "https://domain.com/assets/folder/file.png" -> "https://domain.com/folder/file.png"
 * @param url The full public URL.
 * @returns The URL with "/assets" removed.
 */
export function toDbUrl(url: string): string {
    if (!url) return '';
    try {
        const urlObj = new URL(url);
        urlObj.pathname = urlObj.pathname.replace('/assets', '');
        return urlObj.toString();
    } catch {
        // Fallback for non-URL strings or paths
        return url;
    }
}

/**
 * Converts a "clean" URL from the database to a full public-facing URL
 * by adding the "/assets" path segment back. It safely ignores blob URLs.
 * e.g., "https://domain.com/folder/file.png" -> "https://domain.com/assets/folder/file.png"
 * @param url The URL from the database.
 * @returns The full public URL.
 */
export function toPublicUrl(url: string | null | undefined): string {
    if (!url || url.includes('/assets/') || url.startsWith('blob:')) {
        return url || '';
    }
    try {
        const urlObj = new URL(url);
        urlObj.pathname = `/assets${urlObj.pathname}`;
        return urlObj.toString();
    } catch {
        // Fallback for non-URL strings or paths
        return url;
    }
}
