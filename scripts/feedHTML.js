// Alimentation du fichier HTML selon données API et événements utilisateur



// Alimenter le code HTML qui compose la section des meilleurs films (toute catégories) via l'API
async function feedBestMovies(nbMovies) {
    const urlFilterBestMovies = `http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=${nbMovies+1}`
    const moviesInfos = await getMoviesInfos(urlFilterBestMovies, nbMovies+1)
    await feedBestMovie(moviesInfos[0].id)
    for (i = 1; i < moviesInfos.length; i++){
        let bestMoviesFrameContent = `
                <div id="card${i}" class="movieCard">
                    <img src="" alt="">
                    <div class="movieBanner">
                        <h3 class="movieTitle">${moviesInfos[i].title}</h3>
                        <button class="detailsButton detailsCardButton" data-id="${moviesInfos[i].id}">Détails</button>
                    </div>
                </div>`
        let tagMoviesFrame = document.querySelector("#bestMoviesFrame")
        tagMoviesFrame.insertAdjacentHTML("beforeend", bestMoviesFrameContent)
        let tagImage = document.querySelector(`#card${i} img`)
        setAlternativeImage(tagImage, moviesInfos[i].imageUrl)
        tagImage.alt = moviesInfos[i].title + " image"
    }
}


// Alimenter les données de la section du meilleur film à partir de son id via l'API
async function feedBestMovie(id) {
    const movieInfos = await getFullMovieInfos(`http://localhost:8000/api/v1/titles/${id}`)
    const tagTitle = document.querySelector("#movieContent h2")
    tagTitle.textContent = movieInfos.title
    const tagSummary = document.querySelector("#movieContent p")
    tagSummary.textContent = movieInfos.summary
    const tagImage = document.querySelector("#movieImage img")
    setAlternativeImage(tagImage, movieInfos.imageUrl)
    tagImage.alt = movieInfos.title + " image"
    const tagButton = document.querySelector("#movieContent button")
    tagButton.dataset.id = movieInfos.id
}


// Alimenter le code XML qui compose une section, selon le nom de la categorie à ajouter, 
// le nom de la section dans laquelle ajouter la catégorie, le tout via l'API
async function feedBestMoviesInCategory(categoryName, whereToAdd, nbMovies) {
    const urlFilterBestMoviesInCategory = `http://localhost:8000/api/v1/titles?sort_by=-imdb_score&genre=${categoryName}&page_size=${nbMovies}`
    const moviesInfos = await getMoviesInfos(urlFilterBestMoviesInCategory, nbMovies)
    const tagBestMoviesInCategory = document.getElementById(`${whereToAdd}`)
    if (whereToAdd === "otherCategory") {
        tagBestMoviesInCategory.insertAdjacentHTML("beforeend", 
        `<div id="${categoryName}Category" class="categoryChosen">
            <div id="${categoryName}MoviesFrame" class="moviesFrame"></div>
            <button class="seeBtn" data-see="more" data-section="${whereToAdd}" >Voir plus</button>
        </div>`)   
    } else {
        tagBestMoviesInCategory.insertAdjacentHTML("beforeend", 
        `<div id="${categoryName}Category">
            <h2>${categoryName}</h2>
            <div id="${categoryName}MoviesFrame" class="moviesFrame"></div>
            <button class="seeBtn" data-see="more" data-section="${whereToAdd}">Voir plus</button>
        </div>`)   
    }
    for (i = 0; i < moviesInfos.length; i++){
        let categoryMoviesFrameContent = `
                <div id="card${i}" class="movieCard">
                    <img src="" alt="">
                    <div class="movieBanner">
                        <h3 class="movieTitle">${moviesInfos[i].title}</h3>
                        <button class="detailsButton detailsCardButton" data-id="${moviesInfos[i].id}">Détails</button>
                    </div>
                </div>`
        let tagMoviesFrame = document.querySelector(`#${whereToAdd} #${categoryName}MoviesFrame`)
        tagMoviesFrame.insertAdjacentHTML("beforeend", categoryMoviesFrameContent)
        let tagImage = document.querySelector(`#${whereToAdd} #${categoryName}MoviesFrame #card${i} img`)
        setAlternativeImage(tagImage, moviesInfos[i].imageUrl)
        tagImage.alt = moviesInfos[i].title + " image"
    }
}


// Afficher la fenetre modale
function displayModalWindow() {
    const tagModalWindowBg = document.getElementById("modalWindowBackground")
    tagModalWindowBg.classList.remove("hide")
    initCloseBtnModalWindow()
}


// Alimenter les données de la fenetre Modale
async function feedModalWindow(urlMovie) {
    let movieInfos = await getFullMovieInfos(urlMovie)
    const tagTitle = document.querySelector("#modalWindow h2")
    tagTitle.textContent = movieInfos.title
    const tagInfos = document.querySelector("#modalWindow h3")
    tagInfos.innerHTML = `${movieInfos.year} - ${movieInfos.genres} <br>${movieInfos.rated} - ${movieInfos.duration}minutes (${movieInfos.countries}) <br>Score IMDB : ${movieInfos.imdbScore} <br>Recettes au box-office : ${movieInfos.grossIncome}`
    const tagDirectors = document.getElementById("directors")
    tagDirectors.textContent = movieInfos.directors
    const tagSummary = document.getElementById("summary")
    tagSummary.textContent = movieInfos.longSummary
    const tagActors = document.getElementById("actors")
    tagActors.textContent = movieInfos.actors
    const tagImage = document.querySelector("#modalImage img")
    setAlternativeImage(tagImage, movieInfos.imageUrl)
    tagImage.alt = movieInfos.title + " image"
}


// Afficher toutes les catégories dans le menu déroulant du choix de la categorie
function displayCategoriesChoice(categories) {
    const tagCategoryChoice = document.getElementById("listCategory")
    categories.forEach((categorie) => {
        tagCategoryChoice.insertAdjacentHTML("beforeend", 
            `<option value="${categorie}">${categorie}</option>`
        )
    })
}


// Cacher les films d'une categorie en fonction des querries CSS
function hideMoviesInCategory(section) {
    document.querySelectorAll(`#${section} .movieCard`).forEach((card) => {
        card.classList.remove("show")
    })
}


// Afficher tous les films d'une catégorie
function showMoviesInCategory(section) {
    document.querySelectorAll(`#${section} .movieCard`).forEach((card) => {
        card.classList.add("show")
    })
}


// Accéder à une image alternative dans le cas ou l'url de l'image issue de l'API est invalide
async function setAlternativeImage(tagImage, urlImage) {
    tagImage.src = urlImage
    // détecte un évenement navigateur dans le cas ou il y a une erreur reseau
    tagImage.onerror = () => {
        tagImage.onerror = null
        tagImage.src = "https://picsum.photos/360/480"
        }
}