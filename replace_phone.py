import os
import glob

files = []
for root, dirs, filenames in os.walk(r'd:\Sangameshwarm\frontend'):
    if 'node_modules' in root or '.git' in root:
        continue
    for file in filenames:
        if file.endswith('.js') or file.endswith('.jsx') or file.endswith('.html'):
            files.append(os.path.join(root, file))

replacements = {
    "99999 99999": "90490 41488",
    "9999999999": "9049041488",
    "+11234567890": "+919049041488",
    "+1 123 456 7890": "+91 90490 41488",
    "+88-123-123456": "+91-90490-41488",
    "+85-123-456789": "+91-90490-41488"
}

for file_path in files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content
        for old, new in replacements.items():
            new_content = new_content.replace(old, new)
            
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {file_path}")
    except Exception as e:
        pass
