import sharp from 'sharp';

export default async (req, res) => {
  try {
    // Get the uploaded image
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // REAL Ghibli-style transformations
    const processed = await sharp(buffer)
      .modulate({
        brightness: 1.15,
        saturation: 1.5,  // More vibrant colors
        hue: 15           // Warm tone shift
      })
      .blur(0.3)          // Soft dreamy effect
      .normalise()         // Auto-contrast
      .toFormat('jpeg')
      .toBuffer();

    res.status(200).json({
      url: `data:image/jpeg;base64,${processed.toString('base64')}`
    });

  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: "Failed to process image" });
  }
};
