import { Heart, ShoppingCart, Eye } from "lucide-react";
import Navigation from "./navigation-bar";
import { useState, useEffect, useCallback, useRef } from "react";
import ProductView from "./product-view";

const ProductCard = () => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    window.location.href = "/";
  }

  const badgeCount = useRef(null);
  const [viewModal, setViewModal] = useState({ open: false });
  const [productList, setProductList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  async function fetchProducts(category = "All") {
    const response = await fetch("http://localhost:3000/api/showAllProduct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        category,
      }),
    });

    const data = await response.json();
    if (data.ok) {
      setProductList(data.product);
    } else {
      setProductList([]);
    }
  }

  const quantity = 1;

  async function addToCart(id) {
    const response = await fetch("http://localhost:3000/api/addToCart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        id,
        quantity,
      }),
    });

    const data = await response.json();
    if (data.ok && badgeCount.current?.cartItemsLength) {
      badgeCount.current.cartItemsLength();
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const setCartBadge = useCallback((ref) => {
    badgeCount.current = ref;
  }, []);

  function handleCategoryChange(category) {
    setSelectedCategory(category);
    fetchProducts(category);
  }

  function handleSearch(search) {
    const productsName = document.querySelectorAll(".products-name");
    const searchInput = search.toUpperCase();

    productsName.forEach((item) => {
      const name = item.innerText.toUpperCase();
      if (name.includes(searchInput)) {
        item.parentElement.parentElement.classList.remove("hidden");
      } else {
        item.parentElement.parentElement.classList.add("hidden");
      }
    });
  }

  return (
    <>
      <div className="mb-2">
        <Navigation
          addListProduct={() => fetchProducts(selectedCategory)}
          onCategoryChange={handleCategoryChange}
          onSearchProduct={handleSearch}
          ref={setCartBadge}
        />
      </div>

      <div className="max-w-[1200px] flex items-center justify-center flex-wrap mx-auto">
        {productList?.map((product) => (
          <div
            key={product.id}
            className="w-full mx-2 mb-3 max-w-sm bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative overflow-hidden rounded-t-lg bg-gray-50 dark:bg-gray-700 group">
              <div className="h-48 flex items-center justify-center p-4">
                <div className="w-32 h-40 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-lg shadow-lg flex items-center justify-center">
                  <img
                    src={product.productImage}
                    alt={product.productName}
                    className="object-cover max-h-full rounded"
                  />
                </div>
              </div>

              <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 dark:bg-gray-800">
                <Heart
                  size={16}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                />
              </button>

              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button
                  onClick={() => setViewModal({ open: true, id: product.id })}
                  className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"
                >
                  <Eye size={16} />
                  Quick View
                </button>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                  {product.category}
                </span>
              </div>

              <h5 className="text-xl products-name font-semibold tracking-tight text-gray-900 dark:text-white mb-2">
                {product.productName}
              </h5>

              <p className="text-sm h-[36px] text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${product.price}
                </span>
                <span className="text-xs text-green-600 font-medium">
                  In Stock
                </span>
              </div>

              <button
                onClick={() => addToCart(product.id)}
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={16} />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      <ProductView
        open={viewModal.open}
        id={viewModal.id}
        onclose={() => setViewModal({ open: false })}
      />
    </>
  );
};

export default ProductCard;
