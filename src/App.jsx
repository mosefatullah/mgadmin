import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Posts from "./pages/Posts";

function App() {
 return (
  <>
   <div className="Admin">
    <BrowserRouter basename="/">
     <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/posts" element={<Posts />}></Route>
     </Routes>
    </BrowserRouter>
   </div>
  </>
 );
}

export default App;
