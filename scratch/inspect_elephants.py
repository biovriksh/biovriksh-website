import os
from PIL import Image

files = [f for f in os.listdir("public") if "elephant" in f]
for f in files:
    path = os.path.join("public", f)
    if os.path.isfile(path) and (f.endswith(".png") or f.endswith(".jpg")):
        img = Image.open(path)
        print(f"{f}: {img.size}, mode={img.mode}")
