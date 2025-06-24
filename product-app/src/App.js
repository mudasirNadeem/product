 import logo from './logo.svg';
 import './App.css';
 import { Routes, Route } from 'react-router-dom';
 import Login from './login';
 import SignUp from './sign-up'
import Product from './product-list';
import ProductView from './product-view';
import AddProductModal from './add-product-modal';
 function App() {
 return (
   <Routes>
     <Route path='/' element={<Login />} />
     <Route path='/signup' element={<SignUp />}/>
     <Route path='/product-view' element={<ProductView />}/>
     <Route path='/add-product-modal' element={<AddProductModal />}/>
     <Route path='/product-list' element={<Product />}/>
     <Route path='/about' element={<div>I am About page</div>}/>
   </Routes>
 );
}
 
 export default App;

