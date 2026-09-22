const { del, list } = require("@vercel/blob");

const PHOTO_LIFETIME_MS = 24 * 60 * 60 * 1000;

module.exports = async function cleanupPhotos(request, response) {
    if (request.method !== "GET") {
        response.setHeader("Allow", "GET");
        return response.status(405).json({ error: "Method not allowed." });
    }

    if (
        !process.env.CRON_SECRET ||
        request.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`
    ) {
        return response.status(401).json({ error: "Unauthorized." });
    }

    const cutoff = Date.now() - PHOTO_LIFETIME_MS;
    let cursor;
    let deleted = 0;

    try {
        do {
            const page = await list({
                prefix: "photos/",
                limit: 1000,
                cursor
            });
            const expiredUrls = page.blobs
                .filter((blob) => new Date(blob.uploadedAt).getTime() <= cutoff)
                .map((blob) => blob.url);

            if (expiredUrls.length > 0) {
                await del(expiredUrls);
                deleted += expiredUrls.length;
            }

            cursor = page.hasMore ? page.cursor : undefined;
        } while (cursor);

        return response.status(200).json({ deleted });
    } catch (error) {
        return response.status(500).json({
            error: error.message || "Could not clean up photos."
        });
    }
};
