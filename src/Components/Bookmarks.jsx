import React from "react";
import noImg from "../assets/images/no-img.png";
import "./Model.css";
import "./Bookmark.css";
const Bookmarks = ({
  show,
  bookmarks,
  onClose,
  onSelectArticle,
  onDeleteBookmark,
}) => {
  if (!show) {
    return null;
  }
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          <i className="fa-solid fa-xmark" />
        </span>
        <h2 className="bookmarks-heading">Bookmarked News</h2>
        <div className="bookmarks-list">
          {bookmarks.map((aritcle, index) => (
            <div
              className="bookmark-item"
              key={index}
              onClick={() => onSelectArticle(aritcle)}
            >
              <img src={aritcle.image || noImg} alt={aritcle.title} />
              <h3>{aritcle.title}</h3>
              <span
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteBookmark(aritcle);
                }}
              >
                <i class="fa-regular fa-circle-xmark"></i>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;
