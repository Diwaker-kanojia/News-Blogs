import userImg from "../assets/images/user.jpg";
import noImg from "../assets/images/no-img.png";
import BlogsModal from "./BlogsModal";
import NewsModel from "./NewsModel";
import Bookmarks from "./Bookmarks";
import Calendar from "./Calendar";
import { useEffect, useState } from "react";
import Weather from "./Weather";
import axios from "axios";
import "./News.css";

const categories = [
  "general",
  "world",
  "business",
  "technology",
  "entertainment",
  "sports",
  "science",
  "health",
  "nation",
];

const News = ({ onShowBlogs, blogs, onEditBlog, onDeleteBlog }) => {
  const [headline, setHeadline] = useState(null);
  const [news, setNews] = useState([]);
  const [category, setCategory] = useState("general");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [showbookmarksModal, setShowBookmarksModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showBlogModal, setShowBlogModal] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      let url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&apikey=d2c5cbe0c18fdb73612b683eb40b5175`;

      if (searchQuery) {
        url = `https://gnews.io/api/v4/search?q=${searchQuery}&lang=en&apikey=d2c5cbe0c18fdb73612b683eb40b5175`;
      }
      const res = await axios.get(url);
      const data = res.data.articles;

      data.forEach((article) => {
        if (!article.image) {
          article.image = noImg;
        }
      });

      setHeadline(data[0]);
      setNews(data.slice(1, 7));

      const saveBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

      setBookmarks(saveBookmarks);
    };
    fetchNews();
  }, [category, searchQuery]);

  const handleCategory = (e, cate) => {
    e.preventDefault();
    setCategory(cate);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setSearchInput("");
  };

  const handleArticle = (article) => {
    setSelectedArticle(article);
    setShowModel(true);
  };

  const handleBookmarkClick = (article) => {
    setBookmarks((prevBookmarks) => {
      const updateBookmarks = prevBookmarks.find(
        (bookmark) => bookmark.title === article.title
      )
        ? prevBookmarks.filter((bookmark) => bookmark.title !== article.title)
        : [...prevBookmarks, article];
      localStorage.setItem("bookmarks", JSON.stringify(updateBookmarks));
      return updateBookmarks;
    });
  };

  const handleBlogClick = (blog) => {
    setSelectedPost(blog);
    setShowBlogModal(true);
  };

  const closeBlogModal = () => {
    setShowBlogModal(false);
    setSelectedPost(null);
  };
  return (
    <div className="news">
      <header className="news-header">
        <h1 className="logo">News & Blogs</h1>
        <div className="search-bar">
          <form onSubmit={handleSearch}>
            <input
              value={searchInput}
              type="text"
              placeholder="Search News..."
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
        </div>
      </header>
      <div className="news-content">
        <div className="navbar">
          <div className="user" onClick={onShowBlogs}>
            <img src={userImg} alt="UserImage" />
            <p>Jane's Blog</p>
          </div>
          <nav className="categories">
            <h1 className="nav-heading">Categories</h1>
            <div className="nav-links">
              {categories.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="nav-link"
                  onClick={(e) => handleCategory(e, item)}
                >
                  {item}
                </a>
              ))}
              <a
                href="#"
                className="nav-link"
                onClick={() => setShowBookmarksModal(true)}
              >
                Bookmark <i className="fa-solid fa-bookmark"></i>
              </a>
            </div>
          </nav>
        </div>
        <div className="news-section">
          {headline && (
            <div className="headline" onClick={() => handleArticle(headline)}>
              <img src={headline.image || noImg} alt={headline?.title} />
              <h2 className="headline-title">
                {headline?.title}
                <i
                  className={`${
                    bookmarks.some(
                      (bookmark) => bookmark.title === headline.title
                    )
                      ? "fa-solid"
                      : "fa-regular"
                  } fa-bookmark bookmark`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmarkClick(headline);
                  }}
                ></i>
              </h2>
            </div>
          )}

          <div className="new-grid">
            {news.map((item, index) => (
              <div
                onClick={() => handleArticle(item)}
                className="news-grid-item"
                key={index}
              >
                <img src={item.image || noImg} alt={item.title} />
                <h3>{item.title.slice(0, 35)}... </h3>
                <i
                  className={`${
                    bookmarks.some((bookmark) => bookmark.title === item.title)
                      ? "fa-solid"
                      : "fa-regular"
                  } fa-bookmark bookmark`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmarkClick(item);
                  }}
                ></i>
              </div>
            ))}
          </div>
        </div>
        <NewsModel
          article={selectedArticle}
          show={showModel}
          onClose={() => setShowModel(false)}
        />
        <Bookmarks
          show={showbookmarksModal}
          bookmarks={bookmarks}
          onClose={() => setShowBookmarksModal(false)}
          onSelectArticle={handleArticle}
          onDeleteBookmark={handleBookmarkClick}
        />
        <div className="my-blogs">
          <h1 className="my-blogs-heading">My Blogs</h1>
          <div className="blog-posts">
            {blogs.map((blog, index) => (
              <div
                className="blog-post"
                key={index}
                onClick={() => handleBlogClick(blog)}
              >
                <img src={blog.image || noImg} alt={blog.title} />
                <h3>{blog.title}</h3>
                <div className="post-buttons">
                  <button
                    className="edit-post"
                    onClick={() => onEditBlog(blog)}
                  >
                    <i className="bx bxs-edit"></i>
                  </button>
                  <button
                    className="delete-post"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteBlog(blog);
                    }}
                  >
                    <i className="bx bxs-x-circle"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
          {selectedPost && showBlogModal && (
            <BlogsModal
              show={showBlogModal}
              blog={selectedPost}
              onClose={closeBlogModal}
            />
          )}
        </div>
        <div className="weather-calendar">
          <Weather />
          <Calendar />
        </div>
      </div>
      <footer className="news-footer">
        <p>
          <span>News & Blogs App</span>
        </p>
        <p>&copy; All Right Reserved. By Diw@ker</p>
      </footer>
    </div>
  );
};

export default News;
