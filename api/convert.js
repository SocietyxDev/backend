import sharp from 'sharp';

export default async (req, res) => {
  try {
    // Get uploaded image buffer
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Ghibli-style transformation pipeline
    const processed = await sharp(buffer)
      // Step 1: Boost colors and contrast
      .modulate({
        brightness: 1.1,
        saturation: 1.8,  // Extra vibrant colors
        hue: 20          // Warm tone shift
      })
      // Step 2: Create painterly effect
      .blur(0.7)         // Soften details
      .sharpen({
        sigma: 1,
        flat: 1,
        jagged: 1
      })
      // Step 3: Posterize to mimic hand-painted look
      .pipeline()
      .clone()
      .linear(1.2, -(0.1 * 255)) // Increase contrast
      .modulate({ lightness: 1.1 })
      .toColourspace('b-w')       // Temporary b&w
      .linear(1.3, 0)             // Boost whites
      .composite([{
        input: await sharp(buffer)
          .modulate({ saturation: 1.6 })
          .blur(0.5)
          .toBuffer(),
        blend: 'overlay'         // Combine layers
      }])
      // Final output
      .toFormat('jpeg', { 
        quality: 90,
        mozjpeg: true 
      })
      .toBuffer();

    res.status(200).json({
      url: `data:image/jpeg;base64,${processed.toString('base64')}`
    });

  } catch (error) {
    console.error('Ghibli conversion error:', error);
    res.status(500).json({ 
      error: "Failed to create Ghibli style",
      details: error.message 
    });
  }
};
