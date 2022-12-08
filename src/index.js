import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { queryImage } from './js/fetch';

const searchForm = document.querySelector('.search-form');
const btnLoadMore = document.querySelector('.load-more');
const galleryImg = document.querySelector('.gallery');


let query = '';
let page = 1;

const handleForm = async evt => {
  evt.preventDefault();
  let perPage = 40;
  query = evt.target.searchQuery.value;
  page = 1;
  galleryImg.innerHTML = '';
  btnLoadMore.classList.add('is-hidden');
  const response = await queryImage(query);
  if (response.totalHits) {
    if (response.totalHits > perPage) {
      btnLoadMore.classList.remove('is-hidden');
    
    }
    renderMarkup(response.hits);
    lightbox.refresh();
    // console.log(response.totalHits);
    Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);
  } else {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
};

searchForm.addEventListener('submit', handleForm);

const renderMarkup = data => {
  const markup = data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
                <a href="${largeImageURL}">
                <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
                <div class="info">
                <p class="info-item">
                <b>Likes: </b>${likes}
                </p>
                <p class="info-item">
                <b>Views: </b>${views}
                </p>
                <p class="info-item">
                <b>Comments: </b>${comments}
                </p>
                <p class="info-item">
                <b>Downloads: </b>${downloads}
                </p>
                </div>
                </div>
              `;
      }
    )
    .join('');
  galleryImg.innerHTML += markup;
};

btnLoadMore.addEventListener('click', async () => {
  page += 1;
  btnLoadMore.classList.add('is-hidden');
  const response = await queryImage(query, page);
  let perPage = 40;
  let totalPages = response.totalHits / perPage;
  if (page > totalPages) {
    Notiflix.Notify.info(
      'We are sorry, but you have reached the end of search results.'
    );
  } else {
    btnLoadMore.classList.remove('is-hidden');
  }
  renderMarkup(response.hits);
  lightbox.refresh();
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
});

let lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});
