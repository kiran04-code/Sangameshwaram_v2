import os
import glob

files = []
files.extend(glob.glob(r'd:\Sangameshwarm\frontend\public\home_html\*.html'))
files.extend(glob.glob(r'd:\Sangameshwarm\frontend\src\pages\home_html\*.html'))

old_addr_1 = "Restoria, Arrondissement, Paris 9578"
old_addr_2 = "Restoria, Arrondissement,<br>Paris 9578"

new_addr_1 = "C L, Magic Business Hub, Cups And Coasters, beside Yashodhan Society, near VIIT College, Kondhwa Budruk, Pune, Maharashtra 411048"
new_addr_2 = "C L, Magic Business Hub, Cups And Coasters, beside Yashodhan Society, near VIIT College, Kondhwa Budruk,<br>Pune, Maharashtra 411048"

for file_path in set(files):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content.replace(old_addr_1, new_addr_1).replace(old_addr_2, new_addr_2)

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file_path}")
