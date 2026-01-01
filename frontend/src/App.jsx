import Form from "./Components/Form/Forms"
import Main from './Components/Main/Main.jsx'

import { BrowserRouter, Route, Routes } from "react-router-dom"
import { GoogleOAuthProvider } from '@react-oauth/google'

function App() {
  return (
    <>
      <GoogleOAuthProvider clientId='553005797004-r8f7ri794npsv1kjab782t79p42vg6g3.apps.googleusercontent.com'>
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
