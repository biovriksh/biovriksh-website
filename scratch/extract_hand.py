from PIL import Image
import numpy as np

img = Image.open("public/doctor_elephant_rembg.png").convert("RGBA")
width, height = img.size
print(f"Image Size: {width} x {height}")

# Let's inspect the raised hand region (viewer's right side, top right portion)
# In this character:
# Head/ears are at the top (y: 0 to 0.5 * height)
# The raised hand is on the viewer's right (x: 0.65 * width to width, y: 0.38 * height to 0.62 * height)

# 1. Save main base image
img.save("public/doctor_elephant_base.png")

# 2. Extract hand layer specifically
# Bounding box for the raised hand on viewer's right
hand_crop_box = (int(width * 0.62), int(height * 0.35), int(width * 0.98), int(height * 0.65))
hand_img = Image.new("RGBA", (width, height), (0, 0, 0, 0))

# Copy cropped region onto full-canvas size image so positioning is 100% exact!
cropped_hand = img.crop(hand_crop_box)
hand_img.paste(cropped_hand, hand_crop_box)
hand_img.save("public/doctor_elephant_waving_hand.png")

print("Saved base and hand layers successfully!")
