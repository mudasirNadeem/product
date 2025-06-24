import React, { useState } from 'react';
import { Plus, Search, LogOut, User } from 'lucide-react';
import AddProductModal from './add-product-modal';

export default function Navigation() {
    var [addModal ,  setAddModal] = useState(false);
  return (
    <nav className="bg-white  dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
          <div className='flex items-center'>
                <label className="block whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-300 me-2">
                  Category *
                </label>
                <select defaultValue={"All"} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400">
                  <option value="All">All category</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="books">Books</option>
                  <option value="home">Home & Garden</option>
                  <option value="sports">Sports</option>
                </select>
              </div>
          </div>

          {/* Search */}
          <div className='flex items-center'>
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right - Add Button and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Add Button */}
            <button onClick={() => setAddModal(true)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Add 
            </button>

            {/* User Menu */}
            <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg px-3 py-2 transition-colors">
              <User className="h-5 w-5" />
              <span className="text-sm font-medium">Logout</span>
              <LogOut className="h-4 w-4" />
            </button>
          </div>
          </div>
        </div>
      </div>
      <AddProductModal open={addModal}  onclose={() => setAddModal(false)}/>
    </nav>

  );
}