# Kaana demo video (static)

Place your screen recording here as:

**`kaana-demo.mp4`**

- **Format:** MP4 (H.264 + AAC recommended for broad browser support)
- **Size:** Keep under ~15–25 MB for GitHub Pages if possible (compress with HandBrake / FFmpeg)
- **No backend:** The `<video>` tag loads this file from the same origin as the site—no S3 or API required.

```bash
# Optional: compress (example)
ffmpeg -i input.mov -c:v libx264 -crf 28 -c:a aac -b:a 128k kaana-demo.mp4
```

After adding the file, commit and push; GitHub Pages will serve it like any other static asset.
