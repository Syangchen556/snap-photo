# Vercel Blob photo transfer setup

The photobooth uploads each finished PNG directly from the browser to Vercel
Blob, then displays a QR code that opens the photo on another device.

## One-time Vercel setup

1. Open the deployed project in the Vercel dashboard.
2. Open **Storage**, create a **Blob** store, and connect it to this project.
   Vercel adds `BLOB_READ_WRITE_TOKEN` to the project automatically.
3. In **Settings > Environment Variables**, add `CRON_SECRET` with a random
   value of at least 16 characters.
4. Redeploy the project.

Uploaded photos use hard-to-guess public URLs. A daily cleanup removes photos
older than 24 hours. Because Vercel Hobby cron jobs run once per day, a photo
can remain stored for approximately 24 to 48 hours before cleanup runs.

For local testing, copy `.env.example` to `.env.local` and add a Blob read/write
token from the connected Vercel store. Run the app through Vercel's local
development environment so the `/api/photo-upload` function is available.
