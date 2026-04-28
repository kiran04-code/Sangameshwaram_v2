import os
import urllib.request
import time

urls = {
    'BEVERAGES': 'https://loremflickr.com/400/400/coffee,beverage',
    'MILKSHAKE': 'https://loremflickr.com/400/400/milkshake',
    'PIZZA': 'https://loremflickr.com/400/400/pizza',
    'BURGERS': 'https://loremflickr.com/400/400/burger',
    'MOMOS': 'https://loremflickr.com/400/400/dumplings',
    'SANDWICHES': 'https://loremflickr.com/400/400/sandwich',
    'PASTA': 'https://loremflickr.com/400/400/pasta',
    'MAGGI': 'https://loremflickr.com/400/400/noodles',
    'INDIAN_BREAKFAST': 'https://loremflickr.com/400/400/indian,breakfast',
    'PAV_BHAJI_PULAV': 'https://loremflickr.com/400/400/indian,food',
    'INDIAN_CHINESE': 'https://loremflickr.com/400/400/chinese,food',
    'COOLERS_FRESHNERS': 'https://loremflickr.com/400/400/cold,drink',
    'SPECIAL_COMBOS': 'https://loremflickr.com/400/400/meal,combo',
    'THALI_MEALS': 'https://loremflickr.com/400/400/thali,indian',
    'TOAST': 'https://loremflickr.com/400/400/toast',
    'PARATHA': 'https://loremflickr.com/400/400/paratha,indian',
    'FRIES': 'https://loremflickr.com/400/400/fries',
    'DEFAULT': 'https://loremflickr.com/400/400/food'
}

download_dir = r"d:\Sangameshwarm\frontend\public\home_html\images\categories"
os.makedirs(download_dir, exist_ok=True)

for name, url in urls.items():
    filepath = os.path.join(download_dir, f"{name}.jpg")
    if not os.path.exists(filepath):
        print(f"Downloading {name}...")
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response:
                with open(filepath, 'wb') as out_file:
                    out_file.write(response.read())
            time.sleep(1) # Be nice to the server
        except Exception as e:
            print(f"Failed to download {name}: {e}")
            # If download fails, create a generic random image locally or fallback
            pass
    else:
        print(f"{name} already exists.")

print("Finished downloading images.")
