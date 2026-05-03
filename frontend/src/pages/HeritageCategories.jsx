import React from "react";
import { useNavigate } from "react-router-dom";

const CATEGORY_IMAGE_MAP = {
  BEVERAGES: "/home_html/images/categories/BEVERAGES.jpg",
  MILKSHAKE: "/home_html/images/categories/MILKSHAKE.jpg",
  PIZZA: "/home_html/images/categories/PIZZA.jpg",
  BURGERS: "/home_html/images/categories/BURGERS.jpg",
  MOMOS: "/home_html/images/categories/MOMOS.jpg",
  SANDWICHES: "/home_html/images/categories/SANDWICHES.jpg",
  PASTA: "/home_html/images/categories/PASTA.png",
  MAGGI: "/home_html/images/categories/MAGGI.jpg",
  "INDIAN BREAKFAST": "/home_html/images/categories/INDIAN_BREAKFAST.jpg",
  "PAV BHAJI & PULAV": "/home_html/images/categories/PAV_BHAJI_PULAV.jpg",
  "INDIAN CHINESE": "/home_html/images/categories/INDIAN_CHINESE.jpg",
  "COOLERS AND FRESHNERS": "/home_html/images/categories/COOLERS_FRESHNERS.jpg",
  "SPECIAL COMBOS": "/home_html/images/categories/SPECIAL_COMBOS.jpg",
  "THALI MEAL'S": "/home_html/images/categories/THALI_MEALS.jpg",
  TOAST: "/home_html/images/categories/TOAST.jpg",
  PARATHA: "/home_html/images/categories/PARATHA.jpg",
  FRIES: "/home_html/images/categories/FRIES.jpg",
};

const FALLBACK_CATEGORIES = [
  "BEVERAGES",
  "MILKSHAKE",
  "COOLERS AND FRESHNERS",
  "INDIAN CHINESE",
  "MAGGI",
  "PAV BHAJI & PULAV",
  "PASTA",
  "INDIAN BREAKFAST",
  "THALI MEAL'S",
  "SANDWICHES",
  "TOAST",
  "PARATHA",
  "PIZZA",
  "MOMOS",
  "BURGERS",
  "FRIES",
].map((name) => ({ name, count: 0 }));

const formatCategoryName = (name = "") =>
  name
    .toLowerCase()
    .split(" ")
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(" ");

const HeritageCategories = ({ categories = [] }) => {
  const navigate = useNavigate();
  const categoryList = categories.length > 0 ? categories : FALLBACK_CATEGORIES;

  return (
    <section className="relative px-4 py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 grid gap-8 md:grid-cols-[1fr_0.7fr] md:items-end">
          <div>
            <p
              style={{ fontFamily: "Cormorant Garamond, serif" }}
              className="mb-4 text-[28px] italic leading-none text-[#5f6476] md:text-[34px]"
            >
              Traditional North Indian Café
            </p>

            <h2
              style={{ fontFamily: "Cormorant Garamond, serif" }}
              className="max-w-3xl text-4xl font-bold leading-tight text-[#241713] md:text-6xl"
            >
              Explore our simple &
              <span className="block italic text-[#8B1538]">
                soulful menu.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-[#6B5144] md:text-right">
            Fresh café favourites, warm Indian spices, and comforting traditional
            dishes made easy to explore.
          </p>
        </div>

       
          <div className="flex py-8 flex-wrap items-center justify-start gap-x-8 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7A4A2A]">
            <span>Breakfast</span>
            <span>Paratha</span>
            <span>Pav Bhaji</span>
            <span>Thali</span>
            <span>Fresh Beverages</span>
          </div>
     

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoryList.map((category) => {
            const catKey = (category.name || "").toUpperCase();

            const imgSrc =
              CATEGORY_IMAGE_MAP[catKey] ||
              CATEGORY_IMAGE_MAP[catKey + "S"] ||
              CATEGORY_IMAGE_MAP[catKey.replace(/S$/, "")] ||
              "/home_html/images/categories/BEVERAGES.jpg";

            return (
              <button
                key={category.name}
                type="button"
                onClick={() =>
                  navigate("/menu", { state: { category: category.name } })
                }
                className="group border  bg-[#FFFDF7] p-3 text-left transition duration-300 hover:border-[#8B1538]/50 hover:shadow-[0_18px_40px_rgba(68,39,22,0.10)]"
              >
                <div className="relative h-44 overflow-hidden bg-[#EADCC4]">
                  <img
                    src={imgSrc}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />

                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#F7E6BC]">
                      Category
                    </span>

                    <span className="bg-[#FAF4E8] px-2 py-1 text-[11px] font-bold text-[#8B1538]">
                      {category.count ?? 0}
                    </span>
                  </div>
                </div>

                <div className="px-1 py-4">
                  <h3
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                    className="text-2xl font-bold text-[#241713]"
                  >
                    {formatCategoryName(category.name)}
                  </h3>

                  <div className="mt-3 flex items-center justify-between border-t border-[#E6D4B9] pt-3">
                    <p className="text-xs font-medium text-[#765744]">
                      View available dishes
                    </p>

                    <span className="text-lg text-[#8B1538] transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeritageCategories;
