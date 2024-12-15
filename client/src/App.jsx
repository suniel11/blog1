import { Routes , Route} from 'react-router-dom';
import Home from './pages/Homepage'
import Login from './pages/Login'
import Register from './pages/Register'
import Header from './components/Header';
import Footer from './components/Footer';
import Siderbar from './components/sidebar';
import Homepage from './pages/Homepage';


function App() {
  
  return (
  
  
<div className="flex flex-col items-center justify-center h-screen bg" >
<Header />
<h1 className='text-2xl font-bold underline '> Heading</h1>


<Routes>
  <Route path="/" element={<Homepage/>} />
  <Route path="/login" element={<Login/>} />
  <Route path="/register" element={<Register/>} />


    
</Routes>

</div> 
  )
}

export default App
