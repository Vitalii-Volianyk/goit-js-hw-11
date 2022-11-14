import Axios from "axios";
import SimpleLightbox from "simplelightbox";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

function getImages(search, page = 1) {
	Axios.get('/user', {
		params: {
			key: "31198912-785fc91d0a48dd5c6d0fb52b2",
			q: search,
			image_type: photo,
			orientation: horizontal,
			safesearch: true
		}
	})
		.then(response => response.data)
		.then(response => {

		})
		.catch(error => console.log(error))
}