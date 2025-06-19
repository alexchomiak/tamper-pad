export function getHostnameFromUrl(url: string): string | null {
    try {
      const parsed = new URL(url);
      return parsed.hostname;
    } catch (e) {
      console.warn('[getHostnameFromUrl] Invalid URL:', url);
      return null;
    }
  }