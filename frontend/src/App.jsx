import Form from "./Components/Form/Forms"
import Main from './Components/Main/Main.jsx'

import { BrowserRouter, Route, Routes } from "react-router-dom"
import { GoogleOAuthProvider } from '@react-oauth/google'

function App() {
  return (
    <>
      <GoogleOAuthProvider clientId='521401976640-a5pvvid5j8odcrvk0cbulg3ng1tf9r4e.apps.googleusercontent.com'>
        <BrowserRouter>
          <Routes>
            <Route path='/main/*' element={<Main />} />
            <Route path="/*" element={<Form />} />
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </>
  )
}

export default App
