import './scss/style.scss';

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))




const headerSearchSuggestions = document.querySelector('.input--header-search');
const suggestionList = document.querySelector('.header__suggestion-list');
const cityContainer = document.querySelector('.city__container');
const popupCity = document.querySelector('.pop-up--city');
const loader = document.querySelector('.loader__content');
const cityInput = document.querySelector('.form__input--city');
const cityList = document.querySelector('.form--city-list');
const burgerOpen = document.querySelector('.burger');
const headerMenu = document.querySelector('.header__menu');
const burgerClose = document.querySelector('.nav__close');
const navSlider = Array.from(document.querySelectorAll('.nav__item'));

function createCityMarkup(city) {
  return `
    <li class="form--city-item">
       <span> ${city}</span>
    </li>
  `;
}

function createSuggestionMarkup(name) {
  return `
    <li class="header__suggestion-item">
       <span> ${name}</span>
    </li>
  `;
}

function addMarkupToDOM(container, markup) {
  container.insertAdjacentHTML("afterbegin", markup);
}

let countriesName = [];

const showLoader = (isLoading) => {
  if (isLoading) {
    loader.classList.add('loader--visible');
  } else {
    loader.classList.remove('loader--visible');
  }
}

const fetchCountries = () => {
  return fetch('https://api.hh.ru/areas')
    .then(res => {
      if (!res.ok) {
        return Promise.reject(`Ошибка: ${res.status}`);
      }
      return res.json();
    });
}

cityContainer.addEventListener('click', function () {
  popupCity.classList.add('pop-up--opened');
  if (!countriesName.length) {
    showLoader(true)
    fetchCountries()
      .then(res => {
        res.forEach(elem => countriesName.push(elem.name));
        countriesName.forEach(item => addMarkupToDOM(cityList, createCityMarkup(item)))
      })
      .catch(err => console.log(err))
      .finally(() => showLoader(false));
  }
});

cityInput.addEventListener('input', function () {
  const filteredValues = countriesName.filter(element => element.toLowerCase().includes(this.value));
  cityList.textContent = '';
  filteredValues.forEach(elem => addMarkupToDOM(cityList, createCityMarkup(elem)));
});

const fetchRussianCities = () => {
  return fetch('https://api.hh.ru/areas')
    .then(res => {
      if (!res.ok) {
        return Promise.reject(`Ошибка: ${res.status}`);
      }
      return res.json();
    });
}

const suggestionHeaderSearch = (inputValue) => {
  fetchRussianCities()
    .then(res => res[0])
    .then(res => {
      const citiesName = res.areas.map(elem => elem.name);
      const filteredValues = citiesName.filter(element => element.toLowerCase().includes(inputValue));
      suggestionList.textContent = '';
      filteredValues.forEach(item => addMarkupToDOM(suggestionList, createSuggestionMarkup(item)));
      suggestionList.classList.add('header__suggestion-list--visible');
      if (inputValue.length < 1) {
        suggestionList.textContent = '';
        suggestionList.classList.remove('header__suggestion-list--visible');
      }
      if (!filteredValues.length) {
        suggestionList.textContent = 'Ничего не найдено';
      }
    })
    .catch(err => console.log(err))
}

headerSearchSuggestions.addEventListener('input', function () {
  setTimeout(() => {
    suggestionHeaderSearch(this.value)
  }, 300)
});

popupCity.addEventListener('mousedown', function (e) {
  if (e.target.classList.contains('pop-up--opened') || e.target.classList.contains('pop-up__close')) {
    popupCity.classList.remove('pop-up--opened');
  }
});

burgerOpen.addEventListener('click', function () {
  headerMenu.classList.add('nav--show');
});

burgerClose.addEventListener('click', function () {
  headerMenu.classList.remove('nav--show');
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') {
    plusSlides(-1)
  }
  if (e.key === 'ArrowRight') {
    plusSlides(1)
  }
});

let slideIndex = 0;

const plusSlides = (n) => {
  showSlides(slideIndex += n);
}

const showSlides = (n) => {
  if (n > navSlider.length - 1) { slideIndex = 0 }
  if (n < 0) { slideIndex = navSlider.length - 1 }
  for (let i = 0; i < navSlider.length; i++) {
    if (i !== n) {
      navSlider[i].classList.remove('active');
    }
  }
  navSlider[slideIndex].classList.add('active');
}
showSlides(slideIndex);

