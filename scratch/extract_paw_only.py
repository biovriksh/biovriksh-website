from PIL import Image
import numpy as np

# Load original pristine cutout
img = Image.open("public/doctor_elephant_rembg.png").convert("RGBA")
width, height = img.size

# Save full pristine body
img.save("public/doctor_elephant_pristine_full.png")

# Extract ONLY the top waving paw bulb (top right corner of hand)
# Hand paw bulb is at x: 67% to 88%, y: 40% to 58%
paw_crop = (int(width * 0.66), int(height * 0.40), int(width * 0.88), int(height * 0.58))
cropped_paw = img.crop(paw_crop)

# Create a full-canvas layer with ONLY the top paw bulb
paw_layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
paw_layer.paste(cropped_paw, paw_crop)
paw_layer.save("public/doctor_elephant_paw_bulb.png")

print(f"Pristine full body and paw bulb saved ({width}x{height})")
