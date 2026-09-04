from PIL import Image

# Open rembg image
img = Image.open("public/doctor_elephant_rembg.png").convert("RGBA")
width, height = img.size

# Save main 3D doctor elephant image
img.save("public/doctor_elephant_3d_new.png")

# Create hand layer full canvas
hand_layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))

# Crop the hand area (viewer's right)
# Hand is at x: 62% to 98%, y: 35% to 65%
crop_box = (int(width * 0.61), int(height * 0.35), int(width * 0.98), int(height * 0.65))
cropped = img.crop(crop_box)
hand_layer.paste(cropped, crop_box)

hand_layer.save("public/doctor_elephant_hand_layer_new.png")
print(f"Extracted hand layer successfully ({width}x{height})")
