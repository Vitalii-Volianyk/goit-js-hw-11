import Axios from "axios";
import SimpleLightbox from "simplelightbox";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector("[name=searchQuery]");
const gallery = document.querySelector(".gallery")
const lightbox = new SimpleLightbox('.gallery a', { captionsData: "alt", captionDelay: 250 });

let lastSearch = "";

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
			if (response.hits.length == 0) {
				Notify.warning('Sorry, there are no images matching your search query. Please try again.');
			} else {
				Notify.success(`Hooray! We found ${response.totalHits} images.`);
				gallery.insertAdjacentHTML("beforeend", getCards(response.hits));
				lightbox.refresh();
			}

		})
		.catch(error => console.log(error))
}

function getCards(cards) {
	return cards.map(card => {
		return `<div class="photo-card">
					<a href="${card.largeImageURL}"><img src="${card.webformatURL}" alt="${card.tags}" loading="lazy" /></a>
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
	lastSearch = searchInput.value.trim();
	if (lastSearch) {
		getImages(lastSearch);
	}
})