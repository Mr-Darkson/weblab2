// DOM Elements
const searchInput = document.querySelector('#searchInput');
const searchBtn = document.querySelector('#searchBtn');
const topBtn = document.querySelector('#topBtn');
const backBtn = document.querySelector('#backBtn');
const loading = document.querySelector('#loading');
const animeGrid = document.querySelector('#animeGrid');
const animeDetail = document.querySelector('#animeDetail');

// Initial load
loadTopAnime();

// Event listeners
searchBtn.addEventListener('click', handleSearch);
topBtn.addEventListener('click', loadTopAnime);
backBtn.addEventListener('click', showAnimeList);

async function handleSearch() {
    const query = searchInput.value.trim();
    if (query) {
        await searchAnime(query);
    }
}

async function loadTopAnime() {
    showLoading();
    animeGrid.innerHTML = '';

    try {
        const response = await fetch('https://api.jikan.moe/v4/top/anime?limit=12');
        const { data } = await response.json();
        displayAnimeList(data);
    } catch (error) {
        console.error('Error fetching top anime:', error);
        showError('Ошибка загрузки данных. Пожалуйста, попробуйте позже.');
    } finally {
        hideLoading();
    }
}

async function searchAnime(query) {
    showLoading();
    animeGrid.innerHTML = '';

    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=12`);
        const { data } = await response.json();
        displayAnimeList(data);
    } catch (error) {
        console.error('Error searching anime:', error);
        showError('Ошибка поиска. Пожалуйста, попробуйте позже.');
    } finally {
        hideLoading();
    }
}

function displayAnimeList(animeList) {
    animeGrid.innerHTML = '';

    if (!animeList?.length) {
        showError('Аниме не найдено.');
        return;
    }

    animeList.forEach(anime => {
        const animeCard = document.createElement('div');
        animeCard.className = 'anime-card';
        animeCard.innerHTML = `
      <img src="${anime.images.jpg.image_url}" alt="${anime.title}" class="anime-card__image">
      <h3 class="anime-card__title">${anime.title}</h3>
    `;
        animeCard.addEventListener('click', () => showAnimeDetail(anime.mal_id));
        animeGrid.appendChild(animeCard);
    });

    showAnimeList();
}

async function showAnimeDetail(animeId) {
    showLoading();

    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
        const { data: anime } = await response.json();

        animeDetail.innerHTML = `
      <h2 class="anime-detail__title">${anime.title}</h2>
      <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}" class="anime-detail__image">
      <p class="anime-detail__info"><strong>Тип:</strong> ${anime.type}</p>
      <p class="anime-detail__info"><strong>Эпизоды:</strong> ${anime.episodes || 'Неизвестно'}</p>
      <p class="anime-detail__info"><strong>Статус:</strong> ${anime.status}</p>
      <p class="anime-detail__info"><strong>Рейтинг:</strong> ${anime.score || 'Нет оценки'}</p>
      <p class="anime-detail__info"><strong>Жанры:</strong> ${anime.genres.map(g => g.name).join(', ')}</p>
      <p class="anime-detail__info"><strong>Описание:</strong> ${anime.synopsis || 'Нет описания'}</p>
    `;

        hideAnimeList();
        animeDetail.classList.remove('hidden');
        backBtn.classList.remove('hidden');
    } catch (error) {
        console.error('Error fetching anime details:', error);
        showError('Ошибка загрузки деталей. Пожалуйста, попробуйте позже.');
    } finally {
        hideLoading();
    }
}

function showError(message) {
    animeGrid.innerHTML = `<p class="error">${message}</p>`;
}

// UI Helpers
function showLoading() {
    loading.classList.remove('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showAnimeList() {
    animeGrid.classList.remove('hidden');
    animeDetail.classList.add('hidden');
    backBtn.classList.add('hidden');
}

function hideAnimeList() {
    animeGrid.classList.add('hidden');
}