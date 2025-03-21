import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Container from './components/Container/Container';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './views/LandingPage/LandingPage';
import NotFound from './views/NotFound/NotFound';
import MyCalendar from './views/MyCalendar/MyCalendar';
import UserProfile from './views/UserProfile/UserProfile';
import CreateEvent from './views/CreateEvent/CreateEvent';
import SingleEventView from './views/SingleEventView/SingleEventView';
import MyContacts from './views/MyContacts/MyContacts';
import AdminDashboard from './views/AdminDashboard/AdminDashboard';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase.config';
import { onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { AppContext } from './context/app.context';
import { ToastContainer } from 'react-toastify';
import AuthGuard from './hoc/AuthGuard';
import { AppState, AppContextType } from './types/interfaces';
import BlockCheck from './hoc/BlockCheck';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import Loading from './components/Loading/Loading';


const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    authUser: null, // From Firebase Authentication
    dbUser: null, // From Firestore Database
    loading: true, // Flag for loading user data
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const [user, loading, error] = useAuthState(auth);

  // Update the app state when the user changes
  useEffect(() => {
    if (user && user.uid !== appState.authUser?.uid) {
      setAppState((prevState) => ({
        ...prevState,
        authUser: user,
      }));
    } else if (!user) {
      setAppState((prevState) => ({
        ...prevState,
        authUser: null,
        dbUser: null,
      }));
    }
  }, [user]);

  // Update loading state separately
  useEffect(() => {
    setAppState((prevState) => ({
      ...prevState,
      loading,
    }));
  }, [loading]);

  // Fetch user data only after Firebase authentication is fully loaded + onValue listener for real-time updates
  useEffect(() => {
    if (!user || loading) return;

    const userRef = ref(db, `users/${user.uid}`);

    const unsubscribe = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setAppState((prevState) => ({
          ...prevState,
          dbUser: snapshot.val(),
        }));
      }
    });

    return () => unsubscribe(); // Detach the listener
  }, [user, loading]);

  if (appState.loading) {
    return <Loading />;
  }
  
  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <AppContext.Provider value={{ ...appState, setAppState } as AppContextType}>
      <BrowserRouter>
      <BlockCheck>
        <Header
          isLoginOpen={isLoginOpen}
          setIsLoginOpen={setIsLoginOpen}
          isRegisterOpen={isRegisterOpen}
          setIsRegisterOpen={setIsRegisterOpen}
        />
        <Container className='bg-gray-100 py-8'>
          <ToastContainer />
          <Routes>
            <Route
              index
              path='/'
              element={
                <LandingPage
                  setIsLoginOpen={setIsLoginOpen}
                  setIsRegisterOpen={setIsRegisterOpen}
                />
              }
            />
            <Route
              path='/my-calendar'
              element={
                <AuthGuard>
                  <MyCalendar />
                </AuthGuard>
              }
            />
            <Route
              path='/user/:id'
              element={
                <AuthGuard>
                  <UserProfile />
                </AuthGuard>
              }
            />
            <Route
              path='/my-contacts/:id'
              element={
                <AuthGuard>
                  <MyContacts />
                </AuthGuard>
              }
            />
            <Route path='*' element={<NotFound />} />
            <Route path='/event/:id' element={<SingleEventView />} />
            <Route
              path='/create-event'
              element={
                <AuthGuard>
                  <CreateEvent />
                </AuthGuard>
              }
            />
            <Route
              path='/admin-board'
              element={
                <AuthGuard>
                  {appState.dbUser?.isAdmin ? <AdminDashboard /> : <Navigate to='/' />}
                </AuthGuard>
              }
            />
          </Routes>
        </Container>
        <Footer />
        </BlockCheck>
      </BrowserRouter>
    </AppContext.Provider>
  );
};

export default App;
