import { Key, X} from 'lucide-react';
import { useState , useEffect} from 'react';
const ProductView = ({ open, onclose , id }) => {
  var id = id;
  var [viewProductDetail , setProductDetail] = useState();
  var [loader , setLoader] = useState(true);
  
        async function productView(){
              setLoader(true)
              const response = await fetch("http://localhost:3000/api/viewProduct", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id
        }),
      });
      var data = await response.json();
      if(data.ok){
        if(viewProductDetail){
          setProductDetail(null)
        }
        setProductDetail(data.product);
      }
      setTimeout(() => {
        setLoader(false)
      }, 500);
    }
  
    useEffect(() => {
    productView();
  }, [id,open]);
  if (!open) return null;
  return (
    <>
  
    <div  className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
 
      {/* Modal Box */}
      <div className="relative w-full max-w-5xl max-h-[100vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl m-4">
           {loader ? (

  <p style={{padding:"230px 50%" , margin:'auto'}}> <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
    </svg></p>
) : (
 
  <>
  {viewProductDetail.map((product, key) => (
 <div>
        <div key={key} className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  product Details
                </h3>
                <button onClick={onclose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Product Image */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 flex items-center justify-center h-80">
                          <img src={product.productImage} alt='Product Image'  className='w-80 rounded-lg h-80' />
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded dark:bg-blue-900 dark:text-blue-300">
                          {product.category}
                        </span>
                      </div>

                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                       Product Name {product.productName}
                      </h1>

                        <p className=" text-gray-900 dark:text-white">
                       This is Product Price {product.price}
                      </p>

                      <p className="text-gray-600 overflow-auto h-[162px] dark:text-gray-400 leading-relaxed">
{product.description}
                      </p>

                     
                    </div>
                  </div>
                </div>
                </div>
              ))}
                </>
        )}
      </div>
    </div>
</>

  );

};

export default ProductView;
