import { Calculator, Leaf, X } from "lucide-react"; // or from 'react-icons/fi'
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

function Cart({ open, onClose }) {
  var [cartItems, setCartItems] = useState();
  var [loader, setLoader] = useState();
  var productsTotalPrice = 0;
  var [totalProductPrice, setTotalProductPrice] = useState();

  const userId = localStorage.getItem("userId");
  async function loadCartProduct() {
    setLoader(true);
    const response = await fetch("http://localhost:3000/api/loadCartItems", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
      }),
    });
    const data = await response.json();
    if (data.ok) {
      setCartItems(data.product);
    }
  }

  useEffect(() => {
    loadCartProduct();
    setTimeout(() => {
      calculateTotalPrice();
      setLoader(false);
    }, 100);
  }, [open]);
  if (!open) return null;
  function calculateTotalPrice() {
    var price = document.querySelectorAll(".products-total-price");
    price.forEach((item) => {
      productsTotalPrice += Number(item.innerText);
    });
    setTotalProductPrice(productsTotalPrice);
  }
  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-30"
        onClick={onClose}
      ></div>
      <div
        id="drawer-navigation"
        className="fixed top-0 right-0 z-40 w-[40%] h-screen p-4 overflow-y-auto transition-transform bg-white dark:bg-gray-800"
        tabIndex={-1}
        aria-labelledby="drawer-navigation-label"
      >
        <h5
          id="drawer-navigation-label"
          className="text-base font-semibold text-gray-500  dark:text-gray-400"
        >
          Cart
        </h5>

        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <X size={20} />
          <span className="sr-only">Close menu</span>
        </button>

        <div className="py-4 overflow-y-auto">
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 relative shadow-sm flex items-start gap-4 mb-3"
            >
              <img
                src={item.productImage}
                alt={item.productName}
                className="w-20 h-20 object-cover rounded-md"
              />
              <div className="flex-1 flex justify-between ">
                <div>
                  <h2 className="text-lg font-semibold truncate w-[269px]">
                    {item.productName}
                  </h2>
                  <p className="text-sm text-gray-500 mb-1">
                    {item.description}
                  </p>
                </div>
                <div>
                  <p className="text-xl font-bold mb-1 price">${item.price}</p>
                  <p className="text-green-600 text-sm font-medium mb-2 ">
                    Qty:
                    <label className="quantity"> {item.quantity}</label>
                  </p>

                  <p className="text-blue-600 text-sm font-medium mb-2 text-nowrap ">
                    Total Price:
                    <label className="products-total-price">
                      {Number(item.quantity) * Number(item.price)}
                    </label>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          {loader ? (
            <p className="font-bold flex text-2xl justify-center  text-center items-center text-amber-500">
              Your Total Bill{" "}
              <FaSpinner className="animate-spin ms-2 text-amber-500 text-md" />
            </p>
          ) : (
            <p className="font-bold text-2xl text-center text-amber-500">
              Your Total Bill {totalProductPrice}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Cart;
