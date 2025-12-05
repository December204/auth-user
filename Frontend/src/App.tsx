import { BrowserRouter, Routes, Route } from 'react-router';
import { ChatAppPage } from './pages/ChatAppPage';
import  SignUpPage  from './pages/SignUpPage';
import { SignInPage } from './pages/SignInPage';
import { Toaster } from 'sonner';
function App() {

  return (
    <>
    <Toaster richColors/>
     <BrowserRouter>

       <Routes>
         <Route path='/' element={<ChatAppPage/>} />
         <Route path='/signup' element={<SignUpPage/>} />
         <Route path='/signin' element={<SignInPage/>} />
       </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
