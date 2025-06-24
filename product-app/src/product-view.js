import { Star, X } from 'lucide-react';

const ProductView = ({ open, onclose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal Box */}
      <div className="relative w-full max-w-5xl max-h-[100vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl m-4">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Product Details
          </h3>
          <button onClick={onclose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Product Image */}
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 flex items-center justify-center h-80">
                <div className="w-80 h-80 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-lg shadow-lg flex items-center justify-center">
                  <div className="text-white text-sm font-medium text-center">
                    iPhone 15 Pro<br />Max
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded dark:bg-blue-900 dark:text-blue-300">
                  Electronics
                </span>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Apple iPhone 15 Pro Max
              </h1>

              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">$999</span>
                <span className="text-lg text-gray-500 line-through">$1,199</span>
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded dark:bg-red-900 dark:text-red-300">
                  15% OFF
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Experience the latest in mobile technology with the iPhone 15 Pro Max. Featuring a stunning titanium design, the powerful A17 Pro chip, and an advanced camera system that captures life in extraordinary detail.
              </p>

              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>• Free shipping on orders over $50</p>
                <p>• 30-day return policy</p>
                <p>• 1-year manufacturer warranty</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
