document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const topBtn = document.getElementById('top-btn');
    const backBtn = document.getElementById('back-btn');
    const loading = document.getElementById('loading');
    const animeGrid = document.getElementById('anime-grid');
    const animeDetail = document.getElementById('anime-detail');

    // Загрузка топ аниме при открытии страницы
    loadTopAnime();

    // Обработчики событий
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            searchAnime(query);
        }
    });

    topBtn.addEventListener('click', loadTopAnime);
    backBtn.addEventListener('click', showAnimeList);

    // Функция для загрузки топ аниме
    async function loadTopAnime() {
        showLoading();
        animeGrid.innerHTML = '';

        try {
            const response = await fetch('https://api.jikan.moe/v4/top/anime?limit=12');
            const data = await response.json();
            displayAnimeList(data.data);
        } catch (error) {
            console.error('Error fetching top anime:', error);
            animeGrid.innerHTML = '<p>Ошибка загрузки данных. Пожалуйста, попробуйте позже.</p>';
        } finally {
            hideLoading();
        }
    }

    // Функция для поиска аниме
    async function searchAnime(query) {
        showLoading();
        animeGrid.innerHTML = '';

        try {
            const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=12`);
            const data = await response.json();
            displayAnimeList(data.data);
        } catch (error) {
            console.error('Error searching anime:', error);
            animeGrid.innerHTML = '<p>Ошибка поиска. Пожалуйста, попробуйте позже.</p>';
        } finally {
            hideLoading();
        }
    }

    // Функция для отображения списка аниме
    function displayAnimeList(animeList) {
        animeGrid.innerHTML = '';

        if (!animeList || animeList.length === 0) {
            animeGrid.innerHTML = '<p>Аниме не найдено.</p>';
            return;
        }

        animeList.forEach(anime => {
            const animeCard = document.createElement('div');
            animeCard.className = 'anime-card';
            animeCard.innerHTML = `
        <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
        <h3>${anime.title}</h3>
      `;
            animeCard.addEventListener('click', () => showAnimeDetail(anime.mal_id));
            animeGrid.appendChild(animeCard);
        });

        showAnimeList();
    }

    // Функция для отображения деталей аниме
    async function showAnimeDetail(animeId) {
        showLoading();

        try {
            const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
            const data = await response.json();
            const anime = data.data;

            animeDetail.innerHTML = `
        <h2>${anime.title}</h2>
        <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
        <p><strong>Тип:</strong> ${anime.type}</p>
        <p><strong>Эпизоды:</strong> ${anime.episodes || 'Неизвестно'}</p>
        <p><strong>Статус:</strong> ${anime.status}</p>
        <p><strong>Рейтинг:</strong> ${anime.score || 'Нет оценки'}</p>
        <p><strong>Жанры:</strong> ${anime.genres.map(g => g.name).join(', ')}</p>
        <p><strong>Описание:</strong> ${anime.synopsis || 'Нет описания'}</p>
      `;

            hideAnimeList();
            animeDetail.classList.remove('hidden');
            backBtn.classList.remove('hidden');
        } catch (error) {
            console.error('Error fetching anime details:', error);
            animeDetail.innerHTML = '<p>Ошибка загрузки деталей. Пожалуйста, попробуйте позже.</p>';
        } finally {
            hideLoading();
        }
    }

    // Вспомогательные функции для управления UI
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
});