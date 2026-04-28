import os
import re

for root, dirs, files in os.walk(r'd:\Sangameshwarm\frontend'):
    if 'node_modules' in root or '.git' in root:
        continue
    for file in files:
        if file.endswith('.html') or file.endswith('.js'):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                new_content = content

                # Replace "Restoria, Arrondissement, <br> Paris 9578" with any amount of spaces/newlines
                new_content = re.sub(r'Restoria,\s*Arrondissement,\s*<br>\s*Paris\s*9578', r'C L, Magic Business Hub, Cups And Coasters, beside Yashodhan Society, near VIIT College, Kondhwa Budruk,<br>Pune, Maharashtra 411048', new_content, flags=re.I)
                
                # If there are any stray "Restoria, Arrondissement, Paris 9578" without br
                new_content = re.sub(r'Restoria,\s*Arrondissement,\s*Paris\s*9578', r'C L, Magic Business Hub, Cups And Coasters, beside Yashodhan Society, near VIIT College, Kondhwa Budruk, Pune, Maharashtra 411048', new_content, flags=re.I)

                # Replace +80 (400) 123 4567 or similar
                new_content = re.sub(r'\+80\s*\(\w+\)\s*\w+\s*\w+', r'+91 90490 41488', new_content, flags=re.I)
                
                # Since the previous replacement `9190490414888` might have a typo like `+9190490414888`, let's fix any `9190490414888` back to `919049041488`
                new_content = new_content.replace('9190490414888', '919049041488')
                new_content = new_content.replace('90490414888', '9049041488')

                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated section address/phone in {filepath}")
            except Exception as e:
                pass

print("Done")
