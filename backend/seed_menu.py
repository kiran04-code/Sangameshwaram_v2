import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

MENU_DATA = [
    # BEVERAGES
    {"id": str(uuid.uuid4()), "name": "Cold Coffee", "category": "BEVERAGES", "price": 60, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/800px-A_small_cup_of_coffee.JPG"},
    {"id": str(uuid.uuid4()), "name": "Cold Chocolate", "category": "BEVERAGES", "price": 60, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/800px-A_small_cup_of_coffee.JPG"},
    {"id": str(uuid.uuid4()), "name": "Cold Milk", "category": "BEVERAGES", "price": 50, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/800px-A_small_cup_of_coffee.JPG"},
    {"id": str(uuid.uuid4()), "name": "Thick Cream Coffee", "category": "BEVERAGES", "price": 70, "is_veg": True, "popular": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/800px-A_small_cup_of_coffee.JPG"},
    {"id": str(uuid.uuid4()), "name": "Hot Coffee", "category": "BEVERAGES", "price": 40, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/800px-A_small_cup_of_coffee.JPG"},
    {"id": str(uuid.uuid4()), "name": "Hot Chocolate", "category": "BEVERAGES", "price": 40, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/800px-A_small_cup_of_coffee.JPG"},
    
    # MILKSHAKE
    {"id": str(uuid.uuid4()), "name": "Oreo Milkshake", "category": "MILKSHAKE", "price": 99, "is_veg": True, "popular": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Two_milkshakes.jpg/800px-Two_milkshakes.jpg"},
    {"id": str(uuid.uuid4()), "name": "Brownie Milkshake", "category": "MILKSHAKE", "price": 99, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Two_milkshakes.jpg/800px-Two_milkshakes.jpg"},
    {"id": str(uuid.uuid4()), "name": "KitKat Milkshake", "category": "MILKSHAKE", "price": 99, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Two_milkshakes.jpg/800px-Two_milkshakes.jpg"},
    {"id": str(uuid.uuid4()), "name": "Strawberry Milkshake", "category": "MILKSHAKE", "price": 99, "is_veg": True, "popular": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Two_milkshakes.jpg/800px-Two_milkshakes.jpg"},
    {"id": str(uuid.uuid4()), "name": "Mango Milkshake", "category": "MILKSHAKE", "price": 99, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Two_milkshakes.jpg/800px-Two_milkshakes.jpg"},
    {"id": str(uuid.uuid4()), "name": "Chocolate Milkshake", "category": "MILKSHAKE", "price": 99, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Two_milkshakes.jpg/800px-Two_milkshakes.jpg"},
    
    # COOLERS AND FRESHNERS
    {"id": str(uuid.uuid4()), "name": "Lemon Ice Tea", "category": "COOLERS AND FRESHNERS", "price": 50, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Mojito98775.jpeg/800px-Mojito98775.jpeg"},
    {"id": str(uuid.uuid4()), "name": "Peach Ice Tea", "category": "COOLERS AND FRESHNERS", "price": 60, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Mojito98775.jpeg/800px-Mojito98775.jpeg"},
    {"id": str(uuid.uuid4()), "name": "Virgin Mint Mojito", "category": "COOLERS AND FRESHNERS", "price": 89, "is_veg": True, "popular": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Mojito98775.jpeg/800px-Mojito98775.jpeg"},
    {"id": str(uuid.uuid4()), "name": "Green Apple Mojito", "category": "COOLERS AND FRESHNERS", "price": 89, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Mojito98775.jpeg/800px-Mojito98775.jpeg"},
    {"id": str(uuid.uuid4()), "name": "Kala Khatta Mojito", "category": "COOLERS AND FRESHNERS", "price": 89, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Mojito98775.jpeg/800px-Mojito98775.jpeg"},
    
    # INDIAN CHINESE
    {"id": str(uuid.uuid4()), "name": "Tomato Soup", "category": "INDIAN CHINESE", "price": 80, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Chow_mein_on_a_plate.jpg/800px-Chow_mein_on_a_plate.jpg"},
    {"id": str(uuid.uuid4()), "name": "Veg Corn Soup", "category": "INDIAN CHINESE", "price": 100, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Chow_mein_on_a_plate.jpg/800px-Chow_mein_on_a_plate.jpg"},
    {"id": str(uuid.uuid4()), "name": "Veg Manchow Soup", "category": "INDIAN CHINESE", "price": 110, "is_veg": True, "popular": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Chow_mein_on_a_plate.jpg/800px-Chow_mein_on_a_plate.jpg"},
    {"id": str(uuid.uuid4()), "name": "Veg. Schezwan Soup", "category": "INDIAN CHINESE", "price": 120, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Chow_mein_on_a_plate.jpg/800px-Chow_mein_on_a_plate.jpg"},
    {"id": str(uuid.uuid4()), "name": "Veg Fried Rice", "category": "INDIAN CHINESE", "price": 100, "variants": [{"name": "Regular", "price": 100}, {"name": "Paneer", "price": 120}], "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Chow_mein_on_a_plate.jpg/800px-Chow_mein_on_a_plate.jpg"},
    {"id": str(uuid.uuid4()), "name": "Veg Shezwan Rice", "category": "INDIAN CHINESE", "price": 110, "variants": [{"name": "Regular", "price": 110}, {"name": "Paneer", "price": 130}], "is_veg": True, "popular": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Chow_mein_on_a_plate.jpg/800px-Chow_mein_on_a_plate.jpg"},
    {"id": str(uuid.uuid4()), "name": "Veg Combination Rice", "category": "INDIAN CHINESE", "price": 120, "variants": [{"name": "Regular", "price": 120}, {"name": "Paneer", "price": 140}], "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Chow_mein_on_a_plate.jpg/800px-Chow_mein_on_a_plate.jpg"},
    {"id": str(uuid.uuid4()), "name": "Veg Triple Rice", "category": "INDIAN CHINESE", "price": 170, "variants": [{"name": "Regular", "price": 170}, {"name": "Paneer", "price": 200}], "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Chow_mein_on_a_plate.jpg/800px-Chow_mein_on_a_plate.jpg"},
    {"id": str(uuid.uuid4()), "name": "Veg Fried Noodles", "category": "INDIAN CHINESE", "price": 110, "variants": [{"name": "Regular", "price": 110}, {"name": "Paneer", "price": 130}], "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Chow_mein_on_a_plate.jpg/800px-Chow_mein_on_a_plate.jpg"},
    {"id": str(uuid.uuid4()), "name": "Veg Shezwan Noodles", "category": "INDIAN CHINESE", "price": 120, "variants": [{"name": "Regular", "price": 120}, {"name": "Paneer", "price": 150}], "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Chow_mein_on_a_plate.jpg/800px-Chow_mein_on_a_plate.jpg"},
    {"id": str(uuid.uuid4()), "name": "Veg Tripple Noodles", "category": "INDIAN CHINESE", "price": 190, "variants": [{"name": "Regular", "price": 190}, {"name": "Paneer", "price": 220}], "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Chow_mein_on_a_plate.jpg/800px-Chow_mein_on_a_plate.jpg"},
    {"id": str(uuid.uuid4()), "name": "Veg. Manchurian Dry/Grevy", "category": "INDIAN CHINESE", "price": 160, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Chow_mein_on_a_plate.jpg/800px-Chow_mein_on_a_plate.jpg"},
    {"id": str(uuid.uuid4()), "name": "Paneer 65", "category": "INDIAN CHINESE", "price": 170, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Chow_mein_on_a_plate.jpg/800px-Chow_mein_on_a_plate.jpg"},
    {"id": str(uuid.uuid4()), "name": "Paneer Chilli", "category": "INDIAN CHINESE", "price": 170, "is_veg": True, "popular": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Chow_mein_on_a_plate.jpg/800px-Chow_mein_on_a_plate.jpg"},
    
    # MAGGI
    {"id": str(uuid.uuid4()), "name": "Plain Maggi", "category": "MAGGI", "price": 50, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Maggi_noodles_%281%29.jpg/800px-Maggi_noodles_%281%29.jpg"},
    {"id": str(uuid.uuid4()), "name": "Masala Maggi", "category": "MAGGI", "price": 60, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Maggi_noodles_%281%29.jpg/800px-Maggi_noodles_%281%29.jpg"},
    {"id": str(uuid.uuid4()), "name": "Plain Cheese Maggi", "category": "MAGGI", "price": 70, "is_veg": True, "popular": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Maggi_noodles_%281%29.jpg/800px-Maggi_noodles_%281%29.jpg"},
    {"id": str(uuid.uuid4()), "name": "Masala Cheese Maggi", "category": "MAGGI", "price": 80, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Maggi_noodles_%281%29.jpg/800px-Maggi_noodles_%281%29.jpg"},
    {"id": str(uuid.uuid4()), "name": "Cheese Schezwan Maggi", "category": "MAGGI", "price": 90, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Maggi_noodles_%281%29.jpg/800px-Maggi_noodles_%281%29.jpg"},
    
    # PAV BHAJI & PULAV
    {"id": str(uuid.uuid4()), "name": "Pav Bhaji", "category": "PAV BHAJI & PULAV", "price": 110, "is_veg": True, "popular": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Pav_Bhaji_on_plate.jpg/800px-Pav_Bhaji_on_plate.jpg"},
    {"id": str(uuid.uuid4()), "name": "Pav Bhaji Cheese", "category": "PAV BHAJI & PULAV", "price": 139, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Pav_Bhaji_on_plate.jpg/800px-Pav_Bhaji_on_plate.jpg"},
    {"id": str(uuid.uuid4()), "name": "Tava Pulav", "category": "PAV BHAJI & PULAV", "price": 90, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Pav_Bhaji_on_plate.jpg/800px-Pav_Bhaji_on_plate.jpg"},
    {"id": str(uuid.uuid4()), "name": "Tava Pulav Cheese", "category": "PAV BHAJI & PULAV", "price": 110, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Pav_Bhaji_on_plate.jpg/800px-Pav_Bhaji_on_plate.jpg"},
    {"id": str(uuid.uuid4()), "name": "Paneer Pulav", "category": "PAV BHAJI & PULAV", "price": 120, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Pav_Bhaji_on_plate.jpg/800px-Pav_Bhaji_on_plate.jpg"},
    {"id": str(uuid.uuid4()), "name": "Paneer cheese Pulav", "category": "PAV BHAJI & PULAV", "price": 150, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Pav_Bhaji_on_plate.jpg/800px-Pav_Bhaji_on_plate.jpg"},
    {"id": str(uuid.uuid4()), "name": "Extra Pav for Pav Bhaji (Pair)", "category": "PAV BHAJI & PULAV", "price": 20, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Pav_Bhaji_on_plate.jpg/800px-Pav_Bhaji_on_plate.jpg"},
    {"id": str(uuid.uuid4()), "name": "Extra Pav for Pav", "category": "PAV BHAJI & PULAV", "price": 10, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Pav_Bhaji_on_plate.jpg/800px-Pav_Bhaji_on_plate.jpg"},
    
    # PASTA
    {"id": str(uuid.uuid4()), "name": "Red Sauce Pasta", "category": "PASTA", "price": 149, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "White Sauce Pasta", "category": "PASTA", "price": 149, "is_veg": True, "popular": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Pink Sauce Pasta", "category": "PASTA", "price": 149, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Vada Pav", "category": "INDIAN BREAKFAST", "price": 25, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Cheese Veggies Vada Pav", "category": "INDIAN BREAKFAST", "price": 35, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Crispy Cheese Vadapav", "category": "INDIAN BREAKFAST", "price": 45, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Tarri Poha", "category": "INDIAN BREAKFAST", "price": 30, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Upma", "category": "INDIAN BREAKFAST", "price": 40, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Sabudana Khichdi", "category": "INDIAN BREAKFAST", "price": 60, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Chole Bhature", "category": "INDIAN BREAKFAST", "price": 110, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Bhel Sample", "category": "INDIAN BREAKFAST", "price": 80, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Misal Pav", "category": "INDIAN BREAKFAST", "price": 90, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Dal Rice", "category": "INDIAN BREAKFAST", "price": 79, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Dal Khichdi", "category": "INDIAN BREAKFAST", "price": 99, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Masala Tak", "category": "INDIAN BREAKFAST", "price": 20, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "paneer bhurji", "category": "INDIAN BREAKFAST", "price": 120, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Shev Bhaji Thali", "category": "THALI MEAL'S", "price": 99, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg", "description": "3 chapatis / 2 laccha parathas, dal rice, salad, papad"},
    {"id": str(uuid.uuid4()), "name": "Rajma Thali", "category": "THALI MEAL'S", "price": 99, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg", "description": "3 chapatis / 2 laccha parathas, dal rice, salad, papad"},
    {"id": str(uuid.uuid4()), "name": "Chole Thali", "category": "THALI MEAL'S", "price": 99, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg", "description": "3 chapatis / 2 laccha parathas, dal rice, salad, papad"},
    {"id": str(uuid.uuid4()), "name": "Masala Vanga Thali", "category": "THALI MEAL'S", "price": 99, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg", "description": "3 chapatis / 2 laccha parathas, dal rice, salad, papad"},
    {"id": str(uuid.uuid4()), "name": "Paneer Thali", "category": "THALI MEAL'S", "price": 119, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg", "description": "3 chapatis / 2 laccha parathas, dal rice, salad, papad"},
    {"id": str(uuid.uuid4()), "name": "Extra Chapati", "category": "THALI MEAL'S", "price": 15, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Extra Laccha Paratha", "category": "THALI MEAL'S", "price": 25, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Veg Cheese Grilled Sandwich", "category": "SANDWICHES", "price": 110, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Veg Cheese Club Sandwich", "category": "SANDWICHES", "price": 140, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Chocolate Sandwich", "category": "SANDWICHES", "price": 110, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Cream Cheese Corn Sandwich", "category": "SANDWICHES", "price": 110, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Bombay Masala Cheese Sandwich", "category": "SANDWICHES", "price": 139, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Veg Cheese Paneer Sandwich", "category": "SANDWICHES", "price": 149, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Indore Special Sandwich", "category": "SANDWICHES", "price": 149, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Bread Butter", "category": "TOAST", "price": 40, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Toast Butter", "category": "TOAST", "price": 60, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Cheese Chilli Toast", "category": "TOAST", "price": 100, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Cheese Garlic Bread", "category": "TOAST", "price": 90, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Cheese Toast", "category": "TOAST", "price": 80, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Aloo Paratha", "category": "PARATHA", "price": 80, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Aloo Cheese Paratha", "category": "PARATHA", "price": 110, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Paneer Paratha", "category": "PARATHA", "price": 100, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Paneer Cheese Paratha", "category": "PARATHA", "price": 139, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Margarita Pizza", "category": "PIZZA", "price": 90, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Onion Capsicum", "category": "PIZZA", "price": 110, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Corn Cheese Pizza", "category": "PIZZA", "price": 129, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Peri Peri Paneer Pizza", "category": "PIZZA", "price": 149, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Veggies Pizza", "category": "PIZZA", "price": 149, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Tandoor Cheese Pizza", "category": "PIZZA", "price": 169, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Tandoor Paneer Pizza", "category": "PIZZA", "price": 169, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Farmhouse Pizza", "category": "PIZZA", "price": 199, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Veg Steam Momos", "category": "MOMOS", "price": 69, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Veg Fried Momos", "category": "MOMOS", "price": 79, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Veg Crispy Momos", "category": "MOMOS", "price": 89, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Corn Steam Momos", "category": "MOMOS", "price": 79, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Corn Fried Momos", "category": "MOMOS", "price": 89, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Corn Crispy Momos", "category": "MOMOS", "price": 99, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Paneer Steam Momos", "category": "MOMOS", "price": 99, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Paneer Fried Momos", "category": "MOMOS", "price": 109, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Paneer Crispy Momos", "category": "MOMOS", "price": 119, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Veg Burger", "category": "BURGERS", "price": 70, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Veg Cheese Burger", "category": "BURGERS", "price": 90, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Veg Schezwan Burger", "category": "BURGERS", "price": 110, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Veg Cheese Schezwan Burger", "category": "BURGERS", "price": 129, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Veg Paneer Burger", "category": "BURGERS", "price": 100, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Veg Cheese Paneer Burger", "category": "BURGERS", "price": 130, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Plain fries", "category": "FRIES", "price": 70, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Peri peri fries", "category": "FRIES", "price": 90, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Cheesy fries", "category": "FRIES", "price": 110, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "Cheese ball", "category": "FRIES", "price": 110, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "CRISPY VADAPAV + POHA + TAK", "category": "SPECIAL COMBOS", "price": 79, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "PAV BHAJI + PULAV + LASSI", "category": "SPECIAL COMBOS", "price": 149, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "CHOLE BHATURE + PULAV + LASSI", "category": "SPECIAL COMBOS", "price": 169, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "BURGER + FRIES + COLD DRINK", "category": "SPECIAL COMBOS", "price": 129, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "SANDWICH + FRIES + COLD COFFEE", "category": "SPECIAL COMBOS", "price": 149, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
    {"id": str(uuid.uuid4()), "name": "PIZZA + FRIES + COLD DRINK", "category": "SPECIAL COMBOS", "price": 199, "is_veg": True, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"},
]

async def seed_database():
    print("Checking existing menu items...")
    existing_count = await db.menu_items.count_documents({})
    
    if existing_count > 0:
        print(f"Found {existing_count} existing items. Clearing collection...")
        await db.menu_items.delete_many({})
    
    print(f"Seeding {len(MENU_DATA)} menu items...")
    await db.menu_items.insert_many(MENU_DATA)
    print("✅ Database seeded successfully!")
    
    # Extract and seed categories
    categories = await db.menu_items.distinct("category")
    print(f"\nCategories created: {len(categories)}")
    
    # Clear existing categories
    existing_cats = await db.categories.count_documents({})
    if existing_cats > 0:
        print(f"Found {existing_cats} existing categories. Clearing collection...")
        await db.categories.delete_many({})
    
    # Create category documents
    category_docs = []
    for idx, cat in enumerate(sorted(categories)):
        count = await db.menu_items.count_documents({"category": cat})
        category_docs.append({
            "_id": str(uuid.uuid4()),
            "name": cat,
            "description": f"Delicious {cat.lower()} items",
            "image_url": "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400",
            "display_order": idx,
            "active": True
        })
        print(f"  - {cat}: {count} items")
    
    if category_docs:
        await db.categories.insert_many(category_docs)
        print(f"\n✅ {len(category_docs)} categories seeded successfully!")


if __name__ == "__main__":
    asyncio.run(seed_database())
    client.close()
