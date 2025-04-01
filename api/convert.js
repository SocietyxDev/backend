import sharp from 'sharp';

export default async (req, res) => {
  try {
    // Get the image buffer safely
    let buffer = Buffer.alloc(0);
    for await (const chunk of req) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    if (buffer.length === 0) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Simple Ghibli effect (more reliable version)
    const processed = await sharp(buffer)
      .modulate({
        brightness: 1.1,
        saturation: 1.6
      })
      .toFormat('jpeg')
      .toBuffer();

    res.status(200).json({
      url: `data:image/jpeg;base64,${processed.toString('base64')}`
    });

  } catch (error) {
    console.error('Conversion Error:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      error: "Conversion failed",
      details: error.message 
    });
  }
};
