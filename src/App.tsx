import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Container from './components/Container/Container';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './views/LandingPage/LandingPage';
import NotFound from './views/NotFound/NotFound';
import MyCalendar from './views/MyCalendar/MyCalendar';
import UserProfile from './views/UserProfile/UserProfile';
import CreateEvent from './views/CreateEvent/CreateEvent';
import SingleEventView from './views/SingleEventView/SingleEventView';
import MyContacts from './views/MyContacts/MyContacts';
import AdminDashboard from './views/AdminDashboard/AdminDashboard';
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Container className='p-6'>
        <Header />
        <Routes>
          <Route index path='/' element={<LandingPage />} />
          <Route path='/my-calendar' element={<MyCalendar />} />
          <Route path='/user/:id' element={<UserProfile />} />
          <Route path='/my-contacts/:id' element={<MyContacts />} />
          <Route path='*' element={<NotFound />} />
          <Route path='/event/:id' element={<SingleEventView />} />
          <Route path='/create-event' element={<CreateEvent />} />
          <Route path='/admin-board' element={<AdminDashboard />} />
        </Routes>

        <Footer />
      </Container>
    </BrowserRouter>
  );
};

export default App;
