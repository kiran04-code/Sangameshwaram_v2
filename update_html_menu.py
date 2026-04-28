import os
import re

MENU = {
    "Beverages": [
        ("Cold Coffee", 60), ("Cold Chocolate", 60), ("Cold Milk", 50),
        ("Thick Cream Coffee", 70), ("Hot Coffee", 40), ("Hot Chocolate", 40)
    ],
    "Milkshake": [
        ("Oreo", 99), ("Brownie", 99), ("KitKat", 99),
        ("Strawberry", 99), ("Mango", 99), ("Chocolate", 99)
    ],
    "Coolers and Freshners": [
        ("Lemon Ice Tea", 50), ("Peach Ice Tea", 60), ("Virgin Mint Mojito", 89),
        ("Green Apple Mojito", 89), ("Kala Khatta Mojito", 89)
    ],
    "Indian Chinese": [
        ("Tomato Soup", 80), ("Veg Corn Soup", 100), ("Veg Manchow Soup", 110),
        ("Veg. Schezwan Soup", 120), ("Veg Fried Rice", 100), ("Veg Shezwan Rice", 110),
        ("Veg Combination Rice", 120), ("Veg Triple Rice", 170), ("Veg Fried Noodles", 110),
        ("Veg Shezwan Noodles", 120), ("Veg Tripple Noodles", 190), ("Veg. Manchurian Dry/Grevy", 160),
        ("Paneer 65", 170), ("Paneer Chilli", 170)
    ],
    "Maggi": [
        ("Plain Maggi", 50), ("Plain Cheese Maggi", 70), ("Cheese Schezwan Maggi", 90),
        ("Masala Maggi", 60), ("Masala Cheese Maggi", 80)
    ],
    "Pav Bhaji & Pulav": [
        ("Pav Bhaji", 110), ("Pav Bhaji Cheese", 139), ("Tava Pulav", 90),
        ("Tava Pulav Cheese", 110), ("Paneer Pulav", 120), ("Paneer cheese Pulav", 150),
        ("Extra Pav for Pav Bhaji (Pair)", 20), ("Extra Pav for Pav", 10)
    ],
    "Pasta": [
        ("Red Sauce Pasta", 149), ("White Sauce Pasta", 149), ("Pink Sauce Pasta", 149)
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
    images = [
        "images/cat1_beverage.png",
        "images/cat2_milkshake.png",
        "images/cat3_cooler.png",
        "images/cat4_chinese.png",
        "images/cat5_maggi.png",
        "images/cat6_pavbhaji.png",
        "images/cat7_pasta.png"
    ]
    
    for i, (category, items) in enumerate(MENU.items()):
        cls = "menu-card-style alternate" if alternate else "menu-card-style"
        if i == len(MENU) - 1:
            cls += " last"
            
        html_out += f'''            <!-- menu box -->
            <div class="{cls}">
                <div class="row clearfix">
                    <div class="image-col col-lg-6 col-md-12 col-sm-12">
                        <div class="inner">
                            <div class="image"><img src="{images[i]}" alt="image"></div>
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
                                    <div class="title clearfix"><div class="ttl clearfix"><h6><a href="#">{name}</a></h6></div> <span class="menu-list-line"> </span> <div class="price"><span>₹{price}.00</span></div></div>
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
                        new_content = re.sub(pattern, new_section, content)
                        with open(fpath, 'w', encoding='utf-8') as fobj:
                            fobj.write(new_content)
                        print(f"Updated menu in {fpath}")
                except Exception as e:
                    pass

if __name__ == "__main__":
    update_files()
