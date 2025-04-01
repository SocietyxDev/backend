import sharp from 'sharp';

export default async (req, res) => {
  try {
    // Get image buffer
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Validate image
    if (!buffer || buffer.length < 100) {
      return res.status(400).json({ error: "Invalid image file" });
    }

    // Real Ghibli effect pipeline
    const processed = await sharp(buffer)
      .ensureAlpha()  // Add transparency if missing
      .linear(1.1, -(0.05 * 255)) // Boost contrast
      .modulate({
        brightness: 1.1,
        saturation: 1.8,
        hue: 15
      })
      .recomb([
        [0.8, 0.2, 0],   // Boost reds
        [0.1, 1.1, -0.2], // Supercharge greens
        [0, 0.2, 0.8]     // Reduce blues
      ])
      .blur(0.4)
      .sharpen({ sigma: 0.8 })
      .png({ quality: 90 })
      .toBuffer();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      url: `data:image/png;base64,${processed.toString('base64')}`
    });

  } catch (error) {
    console.error('PROCESSING ERROR:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      error: "Image processing failed",
      details: error.message 
    });
  }
};
