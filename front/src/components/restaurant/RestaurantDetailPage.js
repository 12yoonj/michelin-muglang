import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  setupInfo,
  setupReviews,
  addBookmark,
  subBookmark,
} from "../../redux/restaurantSlice";
import { get, patch } from "../../api";
import styles from "../../css/restaurant/RestaurantDetailPage.module.css";
import Information from "./Information";
import Reviews from "./Reviews";
import NearbyRestaurants from "./NearbyRestaurants";
import Footer from "../Footer";
import LoginRequestModal from "../modal/LoginRequestModal";
import {
  BookmarkBorderOutlined as BookmarkOutlineIcon,
  Bookmark as BookmarkIcon,
} from "@mui/icons-material";

function RestaurantDetailPage() {
  const [{ user }, { restaurantInfo }] = useSelector(
    (state) => [state.user, state.restaurant],
    shallowEqual,
  );
  const [bookmark, setBookmark] = useState(false);
  const [bgImageUrl, setBgImageUrl] = useState("");
  const [loginRequestModal, setLoginRequestModal] = useState(false);

  const restaurantId = useParams().id;
  const dispatch = useDispatch();

  const handleBookmarkClick = () => {
    if (!user) {
      setLoginRequestModal(true);
      return;
    }

    if (bookmark) {
      patch("bookmarks", "undo", { restaurantId });
      dispatch(subBookmark());
      setBookmark(false);
    } else {
      patch("bookmarks", "do", { restaurantId });
      dispatch(addBookmark());
      setBookmark(true);
    }
  };

  const getRestaurantDetail = async () => {
    const getRestaurantInfo = get("restaurants", restaurantId);
    const getRestaurantReviews = get("reviewlist/restaurant", restaurantId);
    const getUserBookmarks = user ? get("bookmarks", user.id) : null;

    try {
      const [restaurantInformation, restaurantReviews, userBookmarks] =
        await Promise.all([
          getRestaurantInfo,
          getRestaurantReviews,
          getUserBookmarks,
        ]);

      dispatch(setupInfo(restaurantInformation.data.data));
      dispatch(setupReviews(restaurantReviews.data));
      const isBookmarked = userBookmarks?.data.some(
        (restaurant) => restaurant._id === restaurantId,
      );
      setBookmark(isBookmarked);
      setBgImageUrl(restaurantInformation.data.data.imageUrl[0]);
    } catch (e) {
      // 에러처리 어떻게 해야할까
      console.log(e);
    }
  };

  useEffect(() => {
    getRestaurantDetail();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div
          className={styles.restaurant_image}
          style={{
            backgroundImage: `linear-gradient( rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7) ), url(${bgImageUrl})`,
          }}
        >
          {restaurantInfo.imageUrl?.map((url) => (
            <img src={url} key={url} alt="img" />
          ))}
        </div>
        <div className={styles.main}>
          <span className={styles.restaurant_name}>{restaurantInfo.name}</span>
          <div className={styles.bookmark} onClick={handleBookmarkClick}>
            {bookmark ? <BookmarkIcon /> : <BookmarkOutlineIcon />}{" "}
            {restaurantInfo.bookmarkCount}번 북마크됨
          </div>
          <Information />
          <Reviews setLoginRequestModal={setLoginRequestModal} />
          <NearbyRestaurants />
        </div>
      </div>
      {loginRequestModal && (
        <LoginRequestModal setLoginRequestModal={setLoginRequestModal} />
      )}
      <Footer />
    </>
  );
}

export default RestaurantDetailPage;
