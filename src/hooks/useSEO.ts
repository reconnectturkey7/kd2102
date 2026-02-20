import { useEffect } from 'react';

/**
 * Custom hook for dynamic SEO (Title and Meta Description)
 * @param title Custom title for the page
 * @param description Custom meta description for the page
 */
export function useSEO(title: string, description?: string) {
    useEffect(() => {
        // Update Document Title
        const originalTitle = document.title;
        document.title = `${title} | KD Ankara`;

        // Update Meta Description
        let metaDescription = document.querySelector('meta[name="description"]');
        const originalDescription = metaDescription?.getAttribute('content') || '';

        if (description) {
            if (!metaDescription) {
                metaDescription = document.createElement('meta');
                metaDescription.setAttribute('name', 'description');
                document.head.appendChild(metaDescription);
            }
            metaDescription.setAttribute('content', description);
        }

        // Cleanup on unmount (optional, but good for SPA)
        return () => {
            document.title = originalTitle;
            if (metaDescription && originalDescription) {
                metaDescription.setAttribute('content', originalDescription);
            }
        };
    }, [title, description]);
}
