import { useState, useEffect } from 'react';
import './App.css';
import Searchbar from './SearchBar/Searchbar';
import axios from 'axios';
import ImageGallery from './ImageGallery/ImageGallery';
import ImageGalleryItem from './ImageGallery/ImageGalleryItem/ImageGalleryItem';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import Notiflix from 'notiflix';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const apiKey = '41220489-c07c1811e7eaf580f7e0f31fa';
const perPage = 12;

export default function App() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalImages, setITotalImages] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [largeImageUrl, setLargeImageUrl] = useState([]);

  const searchImages = query => {
    if (query.trim() === '') {
      Notiflix.Notify.info('Sorry, please provide a search word');
      return;
    }
    setImages([]);
    setActivePage(1);
    setSearchQuery(`${Date.now()}/${query}`);
  };

  const loadMoreImages = () => {
    setActivePage(prev => prev + 1);
  };

  const showLoadMore = () => {
    if (images.length > 0 && totalImages - perPage * activePage > 0) {
      return true;
    }
  };

  const showModal = largeImageUrl => {
    setModalIsOpen(true);
    setLargeImageUrl(largeImageUrl);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleClickModal = evt => {
    if (evt.target.nodeName !== 'IMG') {
      closeModal();
    }
  };

  const handleKeyDown = evt => {
    if (evt.key === 'Escape') {
      closeModal();
    }
  };

  useEffect(() => {
    if (searchQuery) {
      getImages();
    }
  }, [searchQuery, activePage]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getImages = async () => {
    setIsLoading(true);
    const separated = searchQuery.split('/');
    const exstractedQuery = separated[1];
    try {
      const { data } = await axios({
        params: {
          q: exstractedQuery,
          page: activePage,
          key: apiKey,
          image_type: 'photo',
          orientation: 'horizontal',
          per_page: perPage,
        },
      });
      if (data.total === 0) {
        Notiflix.Notify.warning(`
I couldn't find any images`);
      }
      setImages(prev => [...prev, ...data.hits]);
      setITotalImages(data.total);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <Searchbar onSubmit={searchImages} />
      <ImageGallery>
        {images.map(image => (
          <ImageGalleryItem
            key={image.id}
            prewImgUrl={image.webformatURL}
            largeImgUrl={image.largeImageURL}
            tags={image.tags}
            handleClick={showModal}
          />
        ))}
      </ImageGallery>
      {isLoading && <Loader />}
      {error && <p>Sth went wrong...{error.message}</p>}
      {showLoadMore() > 0 && <Button handleClick={loadMoreImages} />}
      {modalIsOpen && (
        <Modal src={largeImageUrl} handleClick={handleClickModal} />
      )}
    </div>
  );
}
