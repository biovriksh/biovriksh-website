import os
from PIL import Image

for name in ["doctor_elephant_body_layer.png", "doctor_elephant_arm_layer.png", "doctor_elephant_rembg.png", "doctor_elephant_transparent.png"]:
    path = os.path.join("public", name)
    if os.path.exists(path):
        img = Image.open(path)
        print(f"{name}: {img.size}, mode={img.mode}")
