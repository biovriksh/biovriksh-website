from PIL import Image, ImageDraw
import numpy as np

# Open rembg cutout of user's elephant image
img = Image.open("public/doctor_elephant_rembg.png").convert("RGBA")
width, height = img.size

# 1. CREATE CLEAN BODY (Erase the raised hand on viewer's right so no double-hand ghosting occurs)
body_img = img.copy()

# Bounding box of the raised hand (viewer's right side, top right)
# Hand is around x: 62% to 98%, y: 36% to 62%
# Let's erase the raised hand pixels in body_img
arr_body = np.array(body_img)

# Mask out the raised hand region (x: 0.63*width to width, y: 0.36*height to 0.62*height)
for y in range(int(height * 0.36), int(height * 0.62)):
    for x in range(int(width * 0.63), int(width * 0.98)):
        # Make transparent
        arr_body[y, x] = [0, 0, 0, 0]

body_clean = Image.fromarray(arr_body, mode="RGBA")
body_clean.save("public/doctor_elephant_body_no_hand.png")

# 2. CREATE ISOLATED WAVING HAND LAYER
hand_layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
arr_orig = np.array(img)
arr_hand = np.zeros_like(arr_orig)

for y in range(int(height * 0.35), int(height * 0.65)):
    for x in range(int(width * 0.62), int(width * 0.99)):
        arr_hand[y, x] = arr_orig[y, x]

hand_clean = Image.fromarray(arr_hand, mode="RGBA")
hand_clean.save("public/doctor_elephant_hand_only_clean.png")

print("Created body_no_hand and hand_only_clean without double-hand overlap!")
