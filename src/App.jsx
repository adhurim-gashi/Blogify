import { Routes, Route } from "react-router"; 
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Posts from "./pages/Posts";
import Categories from "./pages/Categories";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
      <Route index element={<Dashboard />}></Route>
      <Route path="posts" element={<Posts />} />
      <Route path="categories" element={<Categories />} />
      </Route>
    </Routes>
  )
}

export default App;