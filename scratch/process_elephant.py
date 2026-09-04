import sys
from PIL import Image, ImageFilter
import numpy as np

def process_image(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    arr = np.array(img, dtype=np.float32)

    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]

    # The background is off-white / light grey (#F2F2F2 - #FFFFFF)
    # Calculate distance from white/light grey
    # We want to identify the elephant body vs background.
    # Light background: High R, High G, High B and low color saturation (R~=G~=B).
    
    # Calculate luminance/brightness
    brightness = (r + g + b) / 3.0
    
    # Calculate color variance/saturation
    color_diff = np.maximum(np.maximum(np.abs(r - g), np.abs(g - b)), np.abs(b - r))

    # Background threshold: high brightness (>230) and very low color difference (<18)
    bg_mask = (brightness > 225) & (color_diff < 15)
    
    # Soft alpha map
    alpha = np.ones_like(brightness) * 255.0

    # Smooth transition
    # For very bright, neutral pixels, reduce alpha linearly
    fade_start = 220.0
    fade_end = 245.0

    neutral_factor = np.clip((25.0 - color_diff) / 25.0, 0, 1)
    bright_factor = np.clip((brightness - fade_start) / (fade_end - fade_start), 0, 1)
    
    transparency_factor = neutral_factor * bright_factor
    alpha = (1.0 - transparency_factor) * 255.0

    # Protect the elephant (pink ears, grey skin, white coat, red stethoscope)
    # Pink ears: high R, medium G, medium B (r - g > 25)
    # Red stethoscope: high R, low G/B
    # Grey skin: darker than background (< 200)
    # White coat: has subtle shading/shadows
    
    arr[:, :, 3] = np.clip(alpha, 0, 255)
    
    result = Image.fromarray(arr.astype(np.uint8), mode="RGBA")
    result.save(output_path, "PNG")
    print(f"Processed {input_path} -> {output_path} successfully!")

if __name__ == "__main__":
    process_image("public/doctor_elephant_new.jpg", "public/doctor_elephant_user_cutout.png")
