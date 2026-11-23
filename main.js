const timescaleSelectors = document.querySelectorAll(".timescale-selector");
const activityCards = document.querySelectorAll(".activity-card");
const pageMain = document.querySelector('main');
const cardMap = new Map();

let data;
let selectedTimescale = "";


for (let i = 0; i < activityCards.length; i++) {
	cardMap.set(activityCards[i].classList[1].replaceAll("-", " "), activityCards[i]);
}

const getPreviousPrefix = () => {
	if (selectedTimescale.toLowerCase() === "daily") {
		return "Yesterday - ";
	} else if (selectedTimescale.toLowerCase() === "weekly") {
		return "Last Week - ";
	}else {
		return "Last Month - ";
	}
}

function populateDOM() {
	let currentCard;
	if (!data) return null;
	data.forEach((dataSet) => {
		currentCard = cardMap.get(dataSet.title.toLowerCase());
		let timeframeData = dataSet.timeframes;
		let activityData = timeframeData[selectedTimescale.toLowerCase()];
		currentCard.querySelector(".card-content .activity-data .activity-name").textContent = dataSet.title;
		currentCard.querySelector(".card-content .time-spent").textContent = `${activityData.current}hrs`;
		currentCard.querySelector(".card-content .previous-time-spent").textContent = `${getPreviousPrefix()}${activityData.previous}hrs`;
	});
}

fetch('data.json').then((response) => {
	if (!response.ok) throw new Error(`Request failed: ${response.status}`);
	return response.json();
}).then((content) => {
	data = content;
	populateDOM();
}).catch((error) => {
	console.error(error);
	pageMain.textContent = `The attempt to fetch requesed data failed: ${error}`;
});

for (const button of timescaleSelectors) {
	button.classList.contains("active") ? selectedTimescale = button.textContent : null;
	button.addEventListener('click', function () {
		for (const _button of timescaleSelectors) {
			_button.classList.remove("active");
			_button.ariaPressed = "false";
		}
		this.classList.add("active");
		this.ariaPressed = "true";
		selectedTimescale = this.textContent;
		!data ? null : populateDOM();
	})
}

