import Form from "./Components/Form/Forms"
import Home from "./Components/Main/Home"
import Notification from "./Components/Main/Notification"
import AllProduct from "./Components/Main/AllProduct"
import Post from "./Components/Main/Post"

import { BrowserRouter, Route, Routes } from "react-router-dom"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Form />} />
          <Route path='/home' element={<Home />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/products" element={<AllProduct />} />
          <Route path="/posts" element={<Post />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
