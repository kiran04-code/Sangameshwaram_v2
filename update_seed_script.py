import re
import uuid

new_items = [
    # INDIAN BREAKFAST
    {"name": "Vada Pav", "category": "INDIAN BREAKFAST", "price": 25, "is_veg": True},
    {"name": "Cheese Veggies Vada Pav", "category": "INDIAN BREAKFAST", "price": 35, "is_veg": True},
    {"name": "Crispy Cheese Vadapav", "category": "INDIAN BREAKFAST", "price": 45, "is_veg": True},
    {"name": "Tarri Poha", "category": "INDIAN BREAKFAST", "price": 30, "is_veg": True},
    {"name": "Upma", "category": "INDIAN BREAKFAST", "price": 40, "is_veg": True},
    {"name": "Sabudana Khichdi", "category": "INDIAN BREAKFAST", "price": 60, "is_veg": True},
    {"name": "Chole Bhature", "category": "INDIAN BREAKFAST", "price": 110, "is_veg": True},
    {"name": "Bhel Sample", "category": "INDIAN BREAKFAST", "price": 80, "is_veg": True},
    {"name": "Misal Pav", "category": "INDIAN BREAKFAST", "price": 90, "is_veg": True},
    {"name": "Dal Rice", "category": "INDIAN BREAKFAST", "price": 79, "is_veg": True},
    {"name": "Dal Khichdi", "category": "INDIAN BREAKFAST", "price": 99, "is_veg": True},
    {"name": "Masala Tak", "category": "INDIAN BREAKFAST", "price": 20, "is_veg": True},
    {"name": "paneer bhurji", "category": "INDIAN BREAKFAST", "price": 120, "is_veg": True},
    
    # THALI MEAL'S
    {"name": "Shev Bhaji Thali", "category": "THALI MEAL'S", "price": 99, "is_veg": True, "description": "3 chapatis / 2 laccha parathas, dal rice, salad, papad"},
    {"name": "Rajma Thali", "category": "THALI MEAL'S", "price": 99, "is_veg": True, "description": "3 chapatis / 2 laccha parathas, dal rice, salad, papad"},
    {"name": "Chole Thali", "category": "THALI MEAL'S", "price": 99, "is_veg": True, "description": "3 chapatis / 2 laccha parathas, dal rice, salad, papad"},
    {"name": "Masala Vanga Thali", "category": "THALI MEAL'S", "price": 99, "is_veg": True, "description": "3 chapatis / 2 laccha parathas, dal rice, salad, papad"},
    {"name": "Paneer Thali", "category": "THALI MEAL'S", "price": 119, "is_veg": True, "description": "3 chapatis / 2 laccha parathas, dal rice, salad, papad"},
    {"name": "Extra Chapati", "category": "THALI MEAL'S", "price": 15, "is_veg": True},
    {"name": "Extra Laccha Paratha", "category": "THALI MEAL'S", "price": 25, "is_veg": True},
    
    # SANDWICHES
    {"name": "Veg Cheese Grilled Sandwich", "category": "SANDWICHES", "price": 110, "is_veg": True},
    {"name": "Veg Cheese Club Sandwich", "category": "SANDWICHES", "price": 140, "is_veg": True},
    {"name": "Chocolate Sandwich", "category": "SANDWICHES", "price": 110, "is_veg": True},
    {"name": "Cream Cheese Corn Sandwich", "category": "SANDWICHES", "price": 110, "is_veg": True},
    {"name": "Bombay Masala Cheese Sandwich", "category": "SANDWICHES", "price": 139, "is_veg": True},
    {"name": "Veg Cheese Paneer Sandwich", "category": "SANDWICHES", "price": 149, "is_veg": True},
    {"name": "Indore Special Sandwich", "category": "SANDWICHES", "price": 149, "is_veg": True},
    
    # TOAST
    {"name": "Bread Butter", "category": "TOAST", "price": 40, "is_veg": True},
    {"name": "Toast Butter", "category": "TOAST", "price": 60, "is_veg": True},
    {"name": "Cheese Chilli Toast", "category": "TOAST", "price": 100, "is_veg": True},
    {"name": "Cheese Garlic Bread", "category": "TOAST", "price": 90, "is_veg": True},
    {"name": "Cheese Toast", "category": "TOAST", "price": 80, "is_veg": True},
    
    # PARATHA
    {"name": "Aloo Paratha", "category": "PARATHA", "price": 80, "is_veg": True},
    {"name": "Aloo Cheese Paratha", "category": "PARATHA", "price": 110, "is_veg": True},
    {"name": "Paneer Paratha", "category": "PARATHA", "price": 100, "is_veg": True},
    {"name": "Paneer Cheese Paratha", "category": "PARATHA", "price": 139, "is_veg": True},
    
    # PIZZA
    {"name": "Margarita Pizza", "category": "PIZZA", "price": 90, "is_veg": True},
    {"name": "Onion Capsicum", "category": "PIZZA", "price": 110, "is_veg": True},
    {"name": "Corn Cheese Pizza", "category": "PIZZA", "price": 129, "is_veg": True},
    {"name": "Peri Peri Paneer Pizza", "category": "PIZZA", "price": 149, "is_veg": True},
    {"name": "Veggies Pizza", "category": "PIZZA", "price": 149, "is_veg": True},
    {"name": "Tandoor Cheese Pizza", "category": "PIZZA", "price": 169, "is_veg": True},
    {"name": "Tandoor Paneer Pizza", "category": "PIZZA", "price": 169, "is_veg": True},
    {"name": "Farmhouse Pizza", "category": "PIZZA", "price": 199, "is_veg": True},
    
    # MOMO'S
    {"name": "Veg Steam Momos", "category": "MOMOS", "price": 69, "is_veg": True},
    {"name": "Veg Fried Momos", "category": "MOMOS", "price": 79, "is_veg": True},
    {"name": "Veg Crispy Momos", "category": "MOMOS", "price": 89, "is_veg": True},
    {"name": "Corn Steam Momos", "category": "MOMOS", "price": 79, "is_veg": True},
    {"name": "Corn Fried Momos", "category": "MOMOS", "price": 89, "is_veg": True},
    {"name": "Corn Crispy Momos", "category": "MOMOS", "price": 99, "is_veg": True},
    {"name": "Paneer Steam Momos", "category": "MOMOS", "price": 99, "is_veg": True},
    {"name": "Paneer Fried Momos", "category": "MOMOS", "price": 109, "is_veg": True},
    {"name": "Paneer Crispy Momos", "category": "MOMOS", "price": 119, "is_veg": True},
    
    # BURGERS
    {"name": "Veg Burger", "category": "BURGERS", "price": 70, "is_veg": True},
    {"name": "Veg Cheese Burger", "category": "BURGERS", "price": 90, "is_veg": True},
    {"name": "Veg Schezwan Burger", "category": "BURGERS", "price": 110, "is_veg": True},
    {"name": "Veg Cheese Schezwan Burger", "category": "BURGERS", "price": 129, "is_veg": True},
    {"name": "Veg Paneer Burger", "category": "BURGERS", "price": 100, "is_veg": True},
    {"name": "Veg Cheese Paneer Burger", "category": "BURGERS", "price": 130, "is_veg": True},
    
    # FRIES
    {"name": "Plain fries", "category": "FRIES", "price": 70, "is_veg": True},
    {"name": "Peri peri fries", "category": "FRIES", "price": 90, "is_veg": True},
    {"name": "Cheesy fries", "category": "FRIES", "price": 110, "is_veg": True},
    {"name": "Cheese ball", "category": "FRIES", "price": 110, "is_veg": True},
    
    # SPECIAL COMBOS
    {"name": "CRISPY VADAPAV + POHA + TAK", "category": "SPECIAL COMBOS", "price": 79, "is_veg": True},
    {"name": "PAV BHAJI + PULAV + LASSI", "category": "SPECIAL COMBOS", "price": 149, "is_veg": True},
    {"name": "CHOLE BHATURE + PULAV + LASSI", "category": "SPECIAL COMBOS", "price": 169, "is_veg": True},
    {"name": "BURGER + FRIES + COLD DRINK", "category": "SPECIAL COMBOS", "price": 129, "is_veg": True},
    {"name": "SANDWICH + FRIES + COLD COFFEE", "category": "SPECIAL COMBOS", "price": 149, "is_veg": True},
    {"name": "PIZZA + FRIES + COLD DRINK", "category": "SPECIAL COMBOS", "price": 199, "is_veg": True}
]

python_str = ""
for item in new_items:
    desc_str = f', "description": "{item["description"]}"' if "description" in item else ""
    python_str += f'    {{"id": str(uuid.uuid4()), "name": "{item["name"]}", "category": "{item["category"]}", "price": {item["price"]}, "is_veg": {item["is_veg"]}, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Pasta_in_creamsauce.jpg/800px-Pasta_in_creamsauce.jpg"{desc_str}}},\n'

with open(r'd:\Sangameshwarm\backend\seed_menu.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the closing bracket of MENU_DATA
parts = content.split(']\n\nasync def seed_database():')
if len(parts) == 2:
    new_content = parts[0] + ',\n' + python_str + ']\n\nasync def seed_database():' + parts[1]
    with open(r'd:\Sangameshwarm\backend\seed_menu.py', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully updated seed_menu.py")
else:
    print("Could not find the insertion point.")
