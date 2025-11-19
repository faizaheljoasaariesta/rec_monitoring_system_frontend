import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './routers/routes';
import { TopLoadingBar } from '@/components/top-loading-bar';

const App = () => {
  return (
    <Router>
      <TopLoadingBar />

      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
      
    </Router>
  );
};

export default App;
