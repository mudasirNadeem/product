import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle
} from "react";
import { Plus, Search, ShoppingCart, LogOut, User } from "lucide-react";
import AddProductModal from "./add-product-modal";
import Cart from "./cart";

const Navigation = forwardRef(({ addListProduct, onCategoryChange, onSearchProduct }, ref) => {
  const userId = localStorage.getItem("userId");
  const [addModal, setAddModal] = useState(false);
  const [cart, setCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  async function cartItemsLength() {
    const response = await fetch("http://localhost:3000/api/cartItemsLength", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    if (data.ok) {
      setCartItems(data.cartProduct);
    }
  }

  useImperativeHandle(ref, () => ({
    cartItemsLength,
  }));

  useEffect(() => {
    cartItemsLength();
  }, []);

  function findCategory(e) {
    const selected = e.target.value;
    onCategoryChange(selected);
  }

  function searchProduct(e) {
    const selected = e.target.value;
    onSearchProduct(selected);
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Category Filter */}
          <div className="flex items-center">
            <label className="block whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-300 me-2">
              Category *
            </label>
            <select
              defaultValue={"All"}
              onChange={findCategory}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
            >
              <option value="All">All category</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="home">Home & Garden</option>
              <option value="sports">Sports</option>
            </select>
          </div>

          <div className="flex items-center">
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  onChange={searchProduct}
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setAddModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </button>

              <div className="relative">
                <span className="inline-block absolute right-[-5px] top-[-2px] bg-red-600 text-white text-xs font-bold px-1 rounded-full">
                  {cartItems?.length || 0}
                </span>
                <button
                  onClick={() => setCart(true)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border transition-colors"
                >
                  <ShoppingCart className="h-4 w-4" />
                </button>
              </div>

              <a
                href="/"
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg px-3 py-2 transition-colors"
              >
                <User className="h-5 w-5" />
                <span className="text-sm font-medium">Logout</span>
                <LogOut className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <AddProductModal
        addListProduct={addListProduct}
        open={addModal}
        onclose={() => setAddModal(false)}
      />
      <Cart open={cart} onClose={() => setCart(false)} />
    </nav>
  );
});

export default Navigation;
