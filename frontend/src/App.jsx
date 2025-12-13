import Form from "./Components/Form/Forms"
import Home from "./Components/Main/Home"
import Notification from "./Components/Notification/Notification"

import { BrowserRouter, Route, Routes } from "react-router-dom"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Form />}/>
          <Route path='/home' element={<Home />} />
          <Route path="/notification" element={<Notification />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
