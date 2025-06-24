import { X, Upload, FileInput } from 'lucide-react';
import { useState } from 'react';

const AddProductModal = ({ open, onclose }) => {
  var [image , setImage] = useState('');
    var [previewUrl, setPreviewUrl] = useState(null);
  if (!open) return null;
  var userId = localStorage.getItem("userId");
      function handleImage(e){
        var file = e.target.files[0];
        if(file){
          setImage(file)
          setPreviewUrl(URL.createObjectURL(file));
        }
      }
    async function AddProduct(event){
    event.preventDefault();
    const form = event.target.closest("form");
    const formData = new FormData(form);
    const response = await fetch("http://localhost:3000/api/assignProduct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId : userId,
    image: previewUrl,
    productName: formData.get("productName"),
    category: formData.get("category"),
    price: formData.get("price"),
    description: formData.get("description"),
      }),
    });
    const data = await response.json();
    if(data.ok){
     console.log(data.product);
    }

    }
  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl max-h-[100vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl m-4">

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Add New Product
          </h3>
          <button onClick={onclose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <form className="p-6 space-y-6" onSubmit={(event) => AddProduct(event)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Image Upload */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Product Image
              </label>
<input type="file"   accept=".png, .jpg, .jpeg, .svg"
 id="file-upload" onChange={(e) => handleImage(e)} name="productImage" hidden />
              <label
                htmlFor="file-upload"
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 flex items-center justify-center h-80 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
              >
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Click to upload product image
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              </label>
            </div>

            {/* Product Details */}
            <div className="space-y-6">

              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="productName"
                  placeholder="Enter product name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  defaultValue=""
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                >
                  <option value="">Select category</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="books">Books</option>
                  <option value="home">Home & Garden</option>
                  <option value="sports">Sports</option>
                </select>
              </div>

              {/* Pricing */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
                    <input
                      type="number"
                      name="price"
                      placeholder="0.00"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                    />
                  </div>
                </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Enter product description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-end gap-3">
            <button
              onClick={onclose}
              type="button"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
