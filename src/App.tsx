import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './routers/routes';
import { TopLoadingBar } from '@/components/top-loading-bar';
import { Toaster } from "@/components/ui/sonner"

const App = () => {
  return (
    <Router>
      <TopLoadingBar />
      <Toaster />
      
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
      
    </Router>
  );
};

export default App;
