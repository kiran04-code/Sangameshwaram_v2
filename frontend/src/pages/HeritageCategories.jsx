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
  "SPECIAL COMBOS",
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
    <section
      className="relative overflow-hidden bg-[#FFFBF2] px-4 py-20"
      data-testid="categories-section"
    >
      <div className="absolute left-0 top-0 h-32 w-32 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0C50 0 100 50 100 100" stroke="#8B1538" strokeWidth="2" />
          <circle cx="20" cy="20" r="5" fill="#D6A64A" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <div className="mb-4 flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D6A64A]" />
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#8B1538]">
              The Royal Collection
            </p>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D6A64A]" />
          </div>

          <h2
            className="text-4xl font-bold text-[#2A2022] md:text-5xl"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Explore Our <span className="italic text-[#8B1538]">Signature</span> Menu
          </h2>

          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-[2px] w-8 bg-[#D6A64A]/40" />
            <div className="h-2 w-2 rotate-45 bg-[#D6A64A]" />
            <div className="h-[2px] w-8 bg-[#D6A64A]/40" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
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
                onClick={() => navigate("/menu", { state: { category: category.name } })}
                className="group relative flex flex-col items-center focus:outline-none"
                data-testid={`category-${category.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="relative">
                  <div className="absolute inset-[-8px] rounded-full border border-[#D6A64A]/30 transition-transform duration-700 group-hover:rotate-45" />

                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-[4px] border-[#D6A64A] shadow-2xl transition-transform duration-500 group-hover:scale-105 md:h-40 md:w-40">
                    <img
                      src={imgSrc}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
                  </div>

                  <div className="absolute -bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#D6A64A] bg-[#8B1538] text-[10px] font-bold text-white shadow-lg">
                    {category.count ?? 0}
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <h3 className="font-serif text-lg font-bold tracking-wide text-[#2D1B1E] transition-colors group-hover:text-[#8B1538] md:text-xl">
                    {formatCategoryName(category.name)}
                  </h3>

                  <div className="mx-auto mt-2 h-[1px] w-0 bg-[#D6A64A] transition-all duration-300 group-hover:w-full" />

                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#8B1538]/60 group-hover:text-[#8B1538]">
                    View Selections
                  </p>
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
