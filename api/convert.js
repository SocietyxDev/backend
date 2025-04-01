import express from 'express';
import multer from 'multer';
import sharp from 'sharp';

const app = express();
const upload = multer();

// Enable CORS for your frontend
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
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
    res.status(500).json({ error: "Conversion failed" });
  }
});

export default app;
