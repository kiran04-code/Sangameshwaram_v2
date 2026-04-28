import os
import shutil

source_dir = r"d:\Sangameshwarm\frontend\Menu_Category_Images"
dest_dir = r"d:\Sangameshwarm\frontend\public\home_html\images\categories"

mapping = {
    "beverages": "BEVERAGES",
    "burgers": "BURGERS",
    "coolers_and_freshners": "COOLERS_FRESHNERS",
    "fries": "FRIES",
    "indian_breakfast": "INDIAN_BREAKFAST",
    "indian_chinese": "INDIAN_CHINESE",
    "maggi": "MAGGI",
    "milkshake": "MILKSHAKE",
    "momos": "MOMOS",
    "paratha": "PARATHA",
    "pasta": "PASTA",
    "pav_bhaji_&_pulav": "PAV_BHAJI_PULAV",
    "pizza": "PIZZA",
    "sandwiches": "SANDWICHES",
    "special_combo": "SPECIAL_COMBOS",
    "thali_meal's": "THALI_MEALS",
    "toast": "TOAST",
    "hero1": "HERO1",
    "hero2": "HERO2",
    "hero3": "HERO3"
}

for file in os.listdir(source_dir):
    if file == "README.txt":
        continue
    
    base_name, ext = os.path.splitext(file)
    lower_base = base_name.lower()
    
    if lower_base in mapping:
        target_name = mapping[lower_base] + ext.lower()
        src_path = os.path.join(source_dir, file)
        dst_path = os.path.join(dest_dir, target_name)
        shutil.copy2(src_path, dst_path)
        print(f"Copied {file} to {target_name}")
    else:
        print(f"Unmapped file: {file}")
