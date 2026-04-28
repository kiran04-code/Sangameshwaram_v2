import os
import re

MENU = {
    "Beverages": [
        ("Cold Coffee", "60"), ("Cold Chocolate", "60"), ("Cold Milk", "50"),
        ("Thick Cream Coffee", "70"), ("Hot Coffee", "40"), ("Hot Chocolate", "40")
    ],
    "Milkshake": [
        ("Oreo", "99"), ("Brownie", "99"), ("KitKat", "99"),
        ("Strawberry", "99"), ("Mango", "99"), ("Chocolate", "99")
    ],
    "Coolers and Freshners": [
        ("Lemon Ice Tea", "50"), ("Peach Ice Tea", "60"), ("Virgin Mint Mojito", "89"),
        ("Green Apple Mojito", "89"), ("Kala Khatta Mojito", "89")
    ],
    "Indian Chinese": [
        ("Tomato Soup", "80"), ("Veg Corn Soup", "100"), ("Veg Manchow Soup", "110"),
        ("Veg. Schezwan Soup", "120"), ("Veg Fried Rice", "100"), ("Veg Shezwan Rice", "110"),
        ("Veg Combination Rice", "120"), ("Veg Triple Rice", "170"), ("Veg Fried Noodles", "110"),
        ("Veg Shezwan Noodles", "120"), ("Veg Tripple Noodles", "190"), ("Veg. Manchurian Dry/Grevy", "160"),
        ("Paneer 65", "170"), ("Paneer Chilli", "170")
    ],
    "Maggi": [
        ("Plain Maggi", "50"), ("Plain Cheese Maggi", "70"), ("Cheese Schezwan Maggi", "90"),
        ("Masala Maggi", "60"), ("Masala Cheese Maggi", "80")
    ],
    "Pav Bhaji & Pulav": [
        ("Pav Bhaji", "110"), ("Pav Bhaji Cheese", "139"), ("Tava Pulav", "90"),
        ("Tava Pulav Cheese", "110"), ("Paneer Pulav", "120"), ("Paneer cheese Pulav", "150"),
        ("Extra Pav for Pav Bhaji (Pair)", "20"), ("Extra Pav for Pav", "10")
    ],
    "Pasta": [
        ("Red Sauce Pasta", "149"), ("White Sauce Pasta", "149"), ("Pink Sauce Pasta", "149")
    ],
    "Indian Breakfast": [
        ("Vada Pav", "25"), ("Cheese Veggies Vada Pav", "35"), ("Crispy Cheese Vadapav", "45"),
        ("Tarri Poha", "30"), ("Upma", "40"), ("Sabudana Khichdi", "60"),
        ("Chole Bhature", "110"), ("Bhel Sample", "80"), ("Misal Pav", "90"),
        ("Dal Rice", "79"), ("Dal Khichdi", "99"), ("Masala Tak", "20"),
        ("paneer bhurji", "120")
    ],
    "Thali Meal's": [
        ("Shev Bhaji Thali", "99"), ("Rajma Thali", "99"), ("Chole Thali", "99"),
        ("Masala Vanga Thali", "99"), ("Paneer Thali", "119"), ("Extra Chapati", "15"),
        ("Extra Laccha Paratha", "25")
    ],
    "Sandwiches": [
        ("Veg Cheese Grilled Sandwich", "110"), ("Veg Cheese Club Sandwich", "140"),
        ("Chocolate Sandwich", "110"), ("Cream Cheese Corn Sandwich", "110"),
        ("Bombay Masala Cheese Sandwich", "139"), ("Veg Cheese Paneer Sandwich", "149"),
        ("Indore Special Sandwich", "149")
    ],
    "Toast": [
        ("Bread Butter", "40"), ("Toast Butter", "60"), ("Cheese Chilli Toast", "100"),
        ("Cheese Garlic Bread", "90"), ("Cheese Toast", "80")
    ],
    "Paratha": [
        ("Aloo Paratha", "80"), ("Aloo Cheese Paratha", "110"), ("Paneer Paratha", "100"),
        ("Paneer Cheese Paratha", "139")
    ],
    "Pizza": [
        ("Margarita Pizza", "90"), ("Onion Capsicum", "110"), ("Corn Cheese Pizza", "129"),
        ("Peri Peri Paneer Pizza", "149"), ("Veggies Pizza", "149"), ("Tandoor Cheese Pizza", "169"),
        ("Tandoor Paneer Pizza", "169"), ("Farmhouse Pizza", "199")
    ],
    "Momo's": [
        ("Veg Steam Momos", "69"), ("Veg Fried Momos", "79"), ("Veg Crispy Momos", "89"),
        ("Corn Steam Momos", "79"), ("Corn Fried Momos", "89"), ("Corn Crispy Momos", "99"),
        ("Paneer Steam Momos", "99"), ("Paneer Fried Momos", "109"), ("Paneer Crispy Momos", "119")
    ],
    "Burgers": [
        ("Veg Burger", "70"), ("Veg Cheese Burger", "90"), ("Veg Schezwan Burger", "110"),
        ("Veg Cheese Schezwan Burger", "129"), ("Veg Paneer Burger", "100"),
        ("Veg Cheese Paneer Burger", "130")
    ],
    "Fries": [
        ("Plain fries", "70"), ("Peri peri fries", "90"), ("Cheesy fries", "110"),
        ("Cheese ball", "110")
    ],
    "Special Combo": [
        ("CRISPY VADAPAV + POHA + TAK", "79"), ("PAV BHAJI + PULAV + LASSI", "149"),
        ("CHOLE BHATURE + PULAV + LASSI", "169"), ("BURGER + FRIES + COLD DRINK", "129"),
        ("SANDWICH + FRIES + COLD COFFEE", "149"), ("PIZZA + FRIES + COLD DRINK", "199")
    ]
}

def build_menu_html():
    html_out = ""
    # Header
    html_out += '''<!--Menu Section-->
    <section class="menu-card-style-section section-kt">
        <div class="auto-container">
            <div class="menu-card-main">
                <div class="top-pattern"> </div>
                <div class="title-box centered">
                    <div class="title-badge"> <img src="images/menu-title-badge.svg" alt="image" title="image"> </div>
                    <h2 style="color: #FFD700; font-weight: 900; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); padding-bottom: 5px;">Our Complete Menu</h2>
                </div>

                <!-- menu card corner images -->
                <img class="menu-card-corner top-left" src="images/menucard-corner-left-top.png" alt="image">
                <img class="menu-card-corner top-right" src="images/menucard-corner-right-top.png" alt="image">
                <img class="menu-card-corner bottom-left" src="images/menucard-corner-left-bottom.png" alt="image">
                <img class="menu-card-corner bottom-right" src="images/menucard-corner-right-bottom.png" alt="image">
'''
    alternate = True
    category_images = {
        "Beverages": "images/categories/BEVERAGES.jpg",
        "Milkshake": "images/categories/MILKSHAKE.jpg",
        "Coolers and Freshners": "images/categories/COOLERS_FRESHNERS.jpg",
        "Indian Chinese": "images/categories/INDIAN_CHINESE.jpg",
        "Maggi": "images/categories/MAGGI.jpg",
        "Pav Bhaji & Pulav": "images/categories/PAV_BHAJI_PULAV.jpg",
        "Pasta": "images/categories/PASTA.png",
        "Indian Breakfast": "images/categories/INDIAN_BREAKFAST.jpg",
        "Thali Meal's": "images/categories/THALI_MEALS.jpg",
        "Sandwiches": "images/categories/SANDWICHES.jpg",
        "Toast": "images/categories/TOAST.jpg",
        "Paratha": "images/categories/PARATHA.jpg",
        "Pizza": "images/categories/PIZZA.jpg",
        "Momo's": "images/categories/MOMOS.jpg",
        "Burgers": "images/categories/BURGERS.jpg",
        "Fries": "images/categories/FRIES.jpg",
        "Special Combo": "images/categories/SPECIAL_COMBOS.jpg"
    }
    
    for i, (category, items) in enumerate(MENU.items()):
        cls = "menu-card-style alternate" if alternate else "menu-card-style"
        if i == len(MENU) - 1:
            cls += " last"
        
        img_src = category_images.get(category, "images/categories/DEFAULT.jpg")
            
        html_out += f'''            <!-- menu box -->
            <div class="{cls}">
                <div class="row clearfix">
                    <div class="image-col col-lg-6 col-md-12 col-sm-12">
                        <div class="inner">
                            <div class="image"><img src="{img_src}" alt="image"></div>
                        </div>
                    </div>

                    <div class="menu-col col-lg-6 col-md-12 col-sm-12">
                        <div class="inner">
                            <div class="title-box">
                            <h3 style="color: #FFD700; font-weight: bold; padding-bottom: 2px; text-shadow: 1px 1px 3px rgba(0,0,0,0.8);">{category}</h3>
                            </div>
'''
        for name, price in items:
            html_out += f'''                            <!--Block-->
                            <div class="dish-block">
                                <div class="inner-box">
                                    <div class="title clearfix"><div class="ttl clearfix"><h6><a href="#">{name}</a></h6></div> <span class="menu-list-line"> </span> <div class="price"><span>₹{price}</span></div></div>
                                </div>
                            </div>
'''
        html_out += '''                        </div>
                    </div>
                </div>
            </div>
'''
        alternate = not alternate

    html_out += '''            </div>
        </div>
    </section>'''
    return html_out

def update_files():
    new_section = build_menu_html()
    pattern = re.compile(r'<!--Menu Section-->.*?</section>', re.IGNORECASE | re.DOTALL)
    
    frontend_dir = r"d:\Sangameshwarm\frontend"
    for root, d, f in os.walk(frontend_dir):
        if 'node_modules' in root or '.git' in root:
            continue
        for file in f:
            if file.endswith('.html'):
                fpath = os.path.join(root, file)
                try:
                    with open(fpath, 'r', encoding='utf-8') as fobj:
                        content = fobj.read()
                    
                    if re.search(pattern, content):
                        content = re.sub(pattern, new_section, content)

                    # Update hero background images if present
                    content = content.replace("images/hero-img-1.jpg", "images/categories/HERO1.jpg")
                    content = content.replace("images/hero-img-2.jpg", "images/categories/HERO2.jpg")
                    content = content.replace("images/hero-img-3.jpg", "images/categories/HERO3.jpg")

                    with open(fpath, 'w', encoding='utf-8') as fobj:
                        fobj.write(content)
                    print(f"Updated images in {fpath}")
                except Exception as e:
                    print(f"Error on {fpath}: {e}")

if __name__ == "__main__":
    update_files()
