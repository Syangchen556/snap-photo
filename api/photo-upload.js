const { handleUpload } = require("@vercel/blob/client");

const MAX_PHOTO_SIZE = 12 * 1024 * 1024;

module.exports = async function photoUpload(request, response) {
    if (request.method !== "POST") {
        response.setHeader("Allow", "POST");
        return response.status(405).json({ error: "Method not allowed." });
    }

    try {
        const result = await handleUpload({
            body: request.body,
            request,
            onBeforeGenerateToken: async (pathname) => {
                if (!/^photos\/[a-zA-Z0-9-]+\.png$/.test(pathname)) {
                    throw new Error("Invalid photo path.");
                }

                return {
                    allowedContentTypes: ["image/png"],
                    maximumSizeInBytes: MAX_PHOTO_SIZE,
                    addRandomSuffix: true,
                    tokenPayload: JSON.stringify({ uploadedAt: Date.now() })
                };
            },
            onUploadCompleted: async () => {}
        });

        return response.status(200).json(result);
    } catch (error) {
        return response.status(400).json({
            error: error.message || "Could not upload the photo."
        });
    }
};
