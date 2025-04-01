import process from 'process';
import sharp from 'sharp';

// Fix for Vercel environment
process.env.SHARP_IGNORE_GLOBAL_LIBVIPS = '1';

export default async (req, res) => {
  try {
    // Get image buffer (Vercel-compatible way)
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Validate image
    if (!buffer || buffer.length < 100) {
      return res.status(400).json({ error: "Invalid image file" });
    }

    // Basic Ghibli effect (guaranteed to work)
    const processed = await sharp(buffer)
      .modulate({
        brightness: 1.1,
        saturation: 1.5
      })
      .jpeg({ quality: 90 })
      .toBuffer();

    return res.status(200).json({
      url: `data:image/jpeg;base64,${processed.toString('base64')}`
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: "Image processing failed",
      details: error.message 
    });
  }
};
