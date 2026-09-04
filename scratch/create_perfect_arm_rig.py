from PIL import Image, ImageDraw
import numpy as np

# Load the user's 3D Doctor Elephant image cutout
img = Image.open("public/doctor_elephant_rembg.png").convert("RGBA")
width, height = img.size
print(f"Image dimensions: {width} x {height}")

# 1. EXTRACT THE WAVING ARM & HAND (Viewer's right side)
# The raised arm starts near the shoulder (x: 580, y: 440) up to hand tip (x: 850, y: 390)
# Let's create an arm image crop that contains ONLY the waving arm & paw
arr = np.array(img)
arr_arm = np.zeros_like(arr)
arr_body = arr.copy()

# The arm region on viewer's right:
# x: 550 to 860, y: 380 to 650
# We construct a smooth elliptical / polygon mask for the arm joint near the shoulder (x~570, y~500)
for y in range(height):
    for x in range(width):
        # Is this pixel in the raised arm region?
        # Arm is to the right of x=550 and between y=380 and y=650
        if x >= 550 and 380 <= y <= 650:
            # Check alpha
            if arr[y, x, 3] > 0:
                # Assign to arm layer
                arr_arm[y, x] = arr[y, x]

# Save isolated arm layer (881 x 1024 full canvas)
arm_img = Image.fromarray(arr_arm, mode="RGBA")
arm_img.save("public/doctor_elephant_rig_arm.png")

# 2. CREATE CLEAN BODY LAYER
# To prevent double-arm ghosting when the arm waves away from its default position,
# we fill the coat underneath the shoulder joint smoothly with white/grey coat color
# so when the arm rotates, the doctor's coat behind it looks 100% solid and natural!

# In arr_body, erase the hand/paw region above y=460 and x>620
for y in range(height):
    for x in range(width):
        if x >= 620 and y <= 470:
            arr_body[y, x] = [0, 0, 0, 0]

# Smoothly fill the shoulder joint connection area (x: 570..640, y: 440..520) with white coat color [245, 245, 245, 255]
for y in range(440, 520):
    for x in range(570, 640):
        if arr_body[y, x, 3] == 0:
            # Fill with doctor coat white/light grey color
            arr_body[y, x] = [242, 243, 245, 255]

body_img = Image.fromarray(arr_body, mode="RGBA")
body_img.save("public/doctor_elephant_rig_body.png")

print("Created doctor_elephant_rig_arm.png and doctor_elephant_rig_body.png successfully!")
