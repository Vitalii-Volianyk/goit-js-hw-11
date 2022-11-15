import Axios from "axios";
import SimpleLightbox from "simplelightbox";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import "simplelightbox/dist/simple-lightbox.min.css";
import { throttle } from 'throttle-debounce';

const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector("[name=searchQuery]");
const gallery = document.querySelector(".gallery")
const lightbox = new SimpleLightbox('.gallery a', { captionsData: "alt", captionDelay: 250 });
const cardHeight = 320;
let lastSearch = "";
let lastResultCount = 0;
let currentPage = 1;
let pageHeight = document.body.getBoundingClientRect().height;
let viewHeight = visualViewport.height;

async function getImages(search, page = 1) {
	Axios.get('https://pixabay.com/api/', {
		params: {
			key: "31198912-785fc91d0a48dd5c6d0fb52b2",
			q: search,
			image_type: "photo",
			orientation: "horizontal",
			safesearch: true,
			page: page,
			per_page: 40
		}
	})
		.then(response => response.data)
		.then(response => {
			lastResultCount = response.totalHits;
			if (response.hits.length == 0) {
				Notify.warning('Sorry, there are no images matching your search query. Please try again.');
			} else {
				if (currentPage == 1) {
					Notify.success(`Hooray! We found ${response.totalHits} images.`);
				}
				gallery.insertAdjacentHTML("beforeend", getCards(response.hits));
				lightbox.refresh();
				pageHeight = document.body.getBoundingClientRect().height;
			}

		})
		.catch(error => Notify.warning('Sorry, there are no images matching your search query. Please try again.'))
}

function getCards(cards) {
	return cards.map(card => {
		return `<div class="photo-card">
					<a class="card-link" href="${card.largeImageURL}"><img class="card-image" src="${card.webformatURL}" alt="${card.tags}" loading="lazy" /></a>
					<div class="info">
						<p class="info-item">
							<b>Likes</b>
							<span>${card.likes}</span>
						</p>
						<p class="info-item">
							<b>Views</b>
							<span>${card.views}</span>
						</p>
						<p class="info-item">
							<b>Comments</b>
							<span>${card.comments}</span>
						</p>
						<p class="info-item">
							<b>Downloads</b>
							<span>${card.downloads}</span>
						</p>
					</div>
				</div>`;
	}).join('');
}

searchForm.addEventListener("submit", event => {
	event.preventDefault();
	gallery.innerHTML = "";
	currentPage = 1;
	lastSearch = searchInput.value.trim();
	if (lastSearch) {
		getImages(lastSearch);
	}
});

document.addEventListener('scroll', throttle(
	500, (e) => {
		if ((window.scrollY + viewHeight + cardHeight * 2) >= pageHeight) {
			if ((currentPage * 40) < lastResultCount) {
				currentPage += 1;
				getImages(lastSearch, currentPage);
			}
		}
	}));
addEventListener("resize", (event) => {
	viewHeight = visualViewport.height;
});