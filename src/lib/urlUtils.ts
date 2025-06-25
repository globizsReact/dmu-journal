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
 * Normalizes a URL to be publicly accessible via CloudFront by ensuring
 * the /assets/ prefix is NOT in the path. This handles legacy data that might
 * have the prefix and leaves clean URLs untouched. It also safely ignores blob URLs.
 * e.g., "https://domain.com/assets/folder/file.png" -> "https://domain.com/folder/file.png"
 * e.g., "https://domain.com/folder/file.png" -> "https://domain.com/folder/file.png"
 * @param url The URL from the database or other source.
 * @returns The cleaned public URL.
 */
export function toPublicUrl(url: string | null | undefined): string {
    if (!url || url.startsWith('blob:')) {
        return url || '';
    }

    try {
        const urlObj = new URL(url);
        if (urlObj.pathname.startsWith('/assets/')) {
            // Rebuild the URL without '/assets'
            urlObj.pathname = urlObj.pathname.substring('/assets'.length);
        }
        return urlObj.toString();
    } catch (e) {
        // This block catches cases where `url` is not a full URL (e.g., a relative path like '/images/j1.png')
        // In this case, just return the path as is, as it's likely a local asset.
        return url;
    }
}
