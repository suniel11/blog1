import { Routes , Route} from 'react-router-dom';
import Home from './pages/Homepage'
import Login from './pages/Login'
import Register from './pages/Register'
import Header from './components/Header';
import Footer from './components/Footer';
import Siderbar from './components/sidebar';
import Homepage from './pages/Homepage';
import Profile from './pages/Profile';
import UserProfile from './components/UserProfile';
import Conversations from './components/Conversations';
import ConversationsUser from './components/ConversationUser';
import Messages from './components/Mesages';
import ConversationPage from './pages/ConversationPag';
import Timeline from './pages/Timeline';
import SearchAndFollow from './components/SearchAndFollow';
import Friends from './components/Friends';
function App() {
  
  return (
  
  
<div className="h-full bg-gray-900" >
<Header />



<Routes>
  <Route path="/" element={<Timeline/>} />
  <Route path="/search" element={<SearchAndFollow/>} />
  <Route path="/login" element={<Login/>} />
  <Route path="/register" element={<Register/>} />
  <Route path='/profile' element={<Profile/>} />
  <Route path="/profile/:userId" element={<UserProfile />} />
  <Route path='/conversations/:userId' element={<Conversations/>} />
  <Route path="/conversation" element={<ConversationsUser />} />
  <Route path="/conversation/:conversationId" element={<Messages />} />
  <Route path='/messages/:conversationId' element ={<ConversationPage/>} /> 
  <Route path="/timeline" element={<Timeline />} />
  <Route path='/friends' element={<Friends />} />



    
</Routes>
<Footer />

</div> 
  )
}

export default App
