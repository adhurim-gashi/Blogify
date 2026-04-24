import { Routes, Route } from "react-router"; 
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Posts from "./pages/Posts";
import Categories from "./pages/Categories";
import CreatePost from "./pages/CreatePost"; 
import CreateCategory from "./pages/CreateCategory";
import Tags from "./pages/Tags";
import CreateTag from "./pages/CreateTag";
import Comments from "./pages/Comments";
import Pages from "./pages/Pages";
import CreatePage from "./pages/CreatePage";
import Media from "./pages/Media"; 
import UploadMedia from "./pages/UploadMedia";
import Newsletter from "./pages/Newsletter";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import PublicLayout from "./layouts/PublicLayout";

import HomePage from "./pages/public/HomePage";
import BlogPage from "./pages/public/BlogPage";
import SinglePost from "./pages/public/SinglePost";
import AboutPage from "./pages/public/AboutPage";
import ContactPage from "./pages/public/ContactPage";

const App = () => {
  return (

    <Routes>
      {/* Public Routes */}

      <Route element={<PublicLayout />}>
      <Route path="/home" element={<HomePage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<SinglePost />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      </Route>

    


      <Route path="/" element={<AdminLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="posts" element={<Posts />} />
      <Route path="categories" element={<Categories />} />
      <Route path="posts/create" element={<CreatePost />} />
      <Route path="categories/create" element={<CreateCategory />} />
      <Route path="tags" element={<Tags />} />
      <Route path="tags/create" element={<CreateTag />} />
      <Route path="comments" element={<Comments />} />
      <Route path="pages" element={<Pages />} />
      <Route path="pages/create" element={<CreatePage />} />
      <Route path="media" element={<Media />} />
      <Route path="media/upload" element={<UploadMedia />} />
      <Route path="newsletter" element={<Newsletter />} />
      <Route path="settings" element={<Settings />} />
      <Route path="users" element={<Users />} />
      </Route>
    </Routes>
  )
}

export default App;