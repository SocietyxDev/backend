from fastapi import FastAPI, File, UploadFile
from fastapi.responses import Response
import io
from PIL import Image

app = FastAPI()

@app.post("/convert")
async def convert_image(image: UploadFile = File(...)):
    try:
        # Load image
        img = Image.open(image.file).convert("RGB")

        # (Ghibli-style conversion logic should go here)

        # Convert image back to bytes
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='JPEG')
        img_byte_arr.seek(0)

        return Response(content=img_byte_arr.read(), media_type="image/jpeg")
    except Exception as e:
        return {"error": str(e)}
