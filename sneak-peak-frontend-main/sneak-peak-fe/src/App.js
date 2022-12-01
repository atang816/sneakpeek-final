import "./App.css";
import Home from "./components/Home";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Switch,
} from "react-router-dom";
import ShoeInfo from "./Pages/ShoeInfo";
function App() {
  return (
    
     <Router>
        <Routes>
          <Route  path="/" element={<Home />} />
          <Route path="/shoeInfo/:description" element={<ShoeInfo />} />
        </Routes>
      </Router>
   
  );
}

export default App;
