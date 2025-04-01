import sharp from 'sharp';

export default async (req, res) => {
  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const processed = await sharp(buffer)
      .modulate({ brightness: 1.1, saturation: 1.5 })
      .jpeg({ quality: 90 })
      .toBuffer();

    res.status(200).json({
      url: `data:image/jpeg;base64,${processed.toString('base64')}`
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
