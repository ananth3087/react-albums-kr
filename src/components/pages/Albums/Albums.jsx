import React, { useState, useEffect, Suspense } from "react";
import imageFile from "../../../assets/img.png";
//import Carousel from "react-multi-carousel";
//import "react-multi-carousel/lib/styles.css";
import Carousel from "@brainhubeu/react-carousel";
import "@brainhubeu/react-carousel/lib/style.css";
import "./Albums.css";
import { Box, Card, Container, debounce } from "@material-ui/core";
import { Constants } from "../../../utils/Constants";
//import LazyImage from "../../atoms/LazyImage/LazyImage";
const LazyImage = React.lazy(() => import("../../atoms/LazyImage/LazyImage"));

const Albums = () => {
  const albumIncrementCount = 3;
  const [allAlbums, setAllAlbums] = useState([]);
  const [photos, setPhotos] = useState(Constants.CONSTANT.DEFAULT_PHOTOS);
  const [albumCount, setAlbumCount] = useState(0);
  const [loadedAlbums, setLoadedAlbums] = useState([]);
  const [listItems, setListItems] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(1);
  const updateLoadedAlbums = () => {
    const count = albumCount + albumIncrementCount;
    const albums = allAlbums.slice(0, count);
    const newAlbums = allAlbums.slice(albumCount, count);
    console.log(albumCount, albumIncrementCount, newAlbums);
    newAlbums.forEach((item) => {
      fetchPhotos(item.id);
    });
    setLoadedAlbums(albums);
    setAlbumCount(count);
    setIsFetching(false);
  };

  const fetchAlbums = async () => {
    setTimeout(async () => {
      const result = await fetch(`https://jsonplaceholder.typicode.com/albums`);
      const allAlbums = await result.json();
      setAllAlbums(allAlbums);

      setIsFetching(true);
      // setPage(page + 1);
      //setListItems(() => { return [...listItems, ...data]; });
    }, 1000);
  };

  const fetchPhotos = async (albumId) => {
    setTimeout(async () => {
      const result = await fetch(
        `https://jsonplaceholder.typicode.com/photos?albumId=${albumId}`
      );
      const response = await result.json();
      //const currentPhotos = [...photos, ...response];
      //console.log(currentPhotos);
      setPhotos((currentPhotos) => {
        return [...currentPhotos, ...response];
      });

      // setPage(page + 1);
      //setListItems(() => { return [...listItems, ...data]; });
    }, 1000);
  };

  useEffect(() => {
    fetchAlbums();
    //fetchData();
    window.addEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = debounce(() => {
    if (
      Math.ceil(window.innerHeight + window.pageYOffset) !==
        document.documentElement.offsetHeight ||
      isFetching
    )
      return;
    setIsFetching(true);
  }, 100);

  useEffect(() => {
    if (!isFetching) return;
    updateLoadedAlbums();
  }, [isFetching]);

  const fetchMoreListItems = () => {
    //fetchData();
    setIsFetching(false);
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };
  return (
    <>
      <Container maxWidth="md" className="album">
        <div className="album-wrapper">
          {loadedAlbums &&
            loadedAlbums.length > 0 &&
            loadedAlbums.map((item) => {
              const photosInCurrentAlbum = photos.filter(
                (photo) => photo.albumId === item.id
              );
              return (
                <Card className="album-item" key={item.id}>
                  <div className="album-header">
                    <h5 className="album-header__title">{item.title}</h5>
                    <div className="album-header__details">
                      Id: {item.id} userid: {item.userId}
                    </div>
                  </div>
                  <div className="album-body">
                    <div className="album-body__slider">
                      {photosInCurrentAlbum && photosInCurrentAlbum.length > 0 && (
                        <Carousel arrows slidesPerPage={5}>
                          {photosInCurrentAlbum.map((photoItem) => {
                            return (
                              <div
                                className="album-body__slider-item"
                                key={photoItem.id}
                              >
                                <Suspense
                                  fallback={
                                    <img
                                      src={imageFile}
                                      alt="Avatar"
                                      style={{ width: "100%" }}
                                    />
                                  }
                                >
                                  <LazyImage
                                    src={photoItem.thumbnailUrl}
                                    className="album-photo__image"
                                  />
                                </Suspense>
                                <h5 className="album-photo__title">
                                  {photoItem.title}
                                </h5>
                                <div className="album-photo__id">
                                  Id: {photoItem.id}
                                </div>
                              </div>
                            );
                          })}
                        </Carousel>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}

          {/* {listItems.map((listItem) => (
        <div className="card" key={listItem.id}>
          <Suspense
            fallback={
              <img src={imageFile} alt="Avatar" style={{ width: "50%" }} />
            }
          >
            <LazyImage src={listItem.download_url} />
          </Suspense>

          <div className="container">
            <h4>
              <b>{listItem.author}</b>
            </h4>
            <p>Architect & Engineer</p>
          </div>
        </div>
        ))} */}
          {isFetching && (
            <div className="album-loading">
              <h1 className="album-loading__text">
                Fetching more list items...
              </h1>
            </div>
          )}
        </div>
      </Container>
    </>
  );
};

export default Albums;
