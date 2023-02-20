import React, { useContext, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { LoginPage } from './pages/LoginPage';
import { TodoPage } from './pages/TodoPage';
import { Profile } from './pages/Profile';
import { RegisterPage } from './pages/RegisterPage'
import { ForgetPage } from './pages/ForgetPage'
import { ResetPage } from './pages/ResetPage'

export const TokenContext = React.createContext(null);

const ProtectedRoute = ({ element }) => {
  const [accdessToken] = useContext(TokenContext);
  return accdessToken ? element() : <Navigate to="/login" />;
};

function App() {
  const [token,setToken] = useState(null);

  return (
    <div className="App">
      <TokenContext.Provider value={[token, setToken]}>
        <Routes>
          <Route
            path="/"
            element={<ProtectedRoute element={TodoPage} />}
          />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forget" element={<ForgetPage />} />
          <Route path="reset" element={<ResetPage />} />
        </Routes>
      </TokenContext.Provider>
    </div>
  );
}

export default App;
