import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const upload = multer();

// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  next();
});

app.post('/api/convert', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Process with Sharp
    const processed = await sharp(req.file.buffer)
      .modulate({
        brightness: 1.15,
        saturation: 1.5,
        hue: 15
      })
      .blur(0.3)
      .normalise()
      .toFormat('jpeg')
      .toBuffer();

    res.json({
      url: `data:image/jpeg;base64,${processed.toString('base64')}`
    });

  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ 
      error: "Failed to process image",
      details: error.message 
    });
  }
});

export default app;
