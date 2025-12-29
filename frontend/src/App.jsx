import Form from "./Components/Form/Forms"
import Home from "./Components/Main/Home/Home"
import Notification from "./Components/Main/Notification/Notification"
import AllProduct from "./Components/Main/AllProduct/AllProduct"
import Post from "./Components/Main/Post/Post"
import AddPost from "./Components/Main/Post/AddPost"
import OrderType from "./Components/Main/Home/OrderType"
import Deliver from "./Components/Main/Home/Deliver"
import AddProductPage from "./Components/Main/AllProduct/AddProductPage"
import Costumers from "./Components/Main/Costumers/Costumers"
import PaymentResult from "./Components/Main/Home/PaymentResult"
import Order from "./Components/Main/OrderPage/Order"

import { BrowserRouter, Route, Routes } from "react-router-dom"
import { GoogleOAuthProvider } from '@react-oauth/google'

function App() {
  return (
    <>
      <GoogleOAuthProvider clientId='553005797004-r8f7ri794npsv1kjab782t79p42vg6g3.apps.googleusercontent.com'>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<Form />} />
            <Route path='/home' element={<Home />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/products" element={<AllProduct />} />
            <Route path="/posts" element={<Post />} />
            <Route path='/add_post' element={<AddPost />} />
            <Route path='/order_type' element={<OrderType />} />
            <Route path='/order/deliver' element={<Deliver />} />
            <Route path="/add_product" element={<AddProductPage />} />
            <Route path="/costumers" element={<Costumers />} />
            <Route path='/payment' element={<PaymentResult />} />
            <Route path='/orders' element={<Order/>} />
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </>
  )
}

export default App
