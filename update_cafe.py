import os
import re

for root, dirs, files in os.walk(r'd:\Sangameshwarm\frontend'):
    if 'node_modules' in root or '.git' in root:
        continue
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            if 'banquet' in content.lower():
                new_content = re.sub(r'<div class="s-block\s*">\s*<div class="inner">\s*<div class="icon-box"[^>]*>.*?<h6>banquet.*?</div>\s*</div>\s*</div>', '', content, flags=re.IGNORECASE | re.DOTALL)
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Removed banquet hall from {filepath}")

replacements = {
    "Sangameshwar Restaurant": "Sangameshwar Cafe",
    "Manage restaurant categories": "Manage cafe categories",
    "Restaurant Information": "Cafe Information",
    "Restaurant Settings": "Cafe Settings",
    "Restaurant Name": "Cafe Name",
    "Restaurants HTML Template": "Cafes HTML Template",
    "booking@restaurant.com": "booking@cafe.com",
    "CATEGORIES & RESTAURANTS": "CATEGORIES & CAFES",
    "Top Restaurants": "Top Cafes",
    "description\" content=\"Sangameshwar Restaurant\"": "description\" content=\"Sangameshwar Cafe\"",
    "<title>Sangameshwar Restaurant</title>": "<title>Sangameshwar Cafe</title>"
}

for root, dirs, files in os.walk(r'd:\Sangameshwarm\frontend'):
    if 'node_modules' in root or '.git' in root:
        continue
    for file in files:
        if file.endswith('.js') or file.endswith('.jsx') or file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            for old, new in replacements.items():
                new_content = new_content.replace(old, new)
                
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated cafe names in {filepath}")

print("Done")
