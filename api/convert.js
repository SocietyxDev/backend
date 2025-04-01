import express from 'express';
import multer from 'multer';
import sharp from 'sharp';

const app = express();
const upload = multer();

// Critical CORS settings for your frontend
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/api/convert', upload.single('image'), async (req, res) => {
  try {
    const processed = await sharp(req.file.buffer)
      .modulate({ brightness: 1.1, saturation: 1.3 })
      .toBuffer();

    res.json({ 
      url: `data:image/jpeg;base64,${processed.toString('base64')}` 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: "Server error during conversion" });
  }
});

export default app;
