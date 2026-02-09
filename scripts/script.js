// Récupération des données json via une requete sur l'API
async function getData(url) {
    const response = await fetch(url)
    const data = await response.json()
    return data
}


// Récupération de l'id, titre et url d'image d'un nombre de film donné selon une requete sur l'API
async function getMoviesInfos(url, nbMovieIds) {
    const data = await getData(url)
    const moviesInfos = []
    const max = Math.min(nbMovieIds, data.results.length)
    for (let i = 0; i < max; i++) {
        let movieInfos = {
            id: data.results[i].id,
            title: data.results[i].title,
            imageUrl: data.results[i].image_url
        }
        moviesInfos.push(movieInfos)
    }
    return moviesInfos 

}


// Récupération de l'id, et de toutes les informations du premier film selon une requete sur l'API
async function getInfosFromFirstId(url) {
    const id = (await getMoviesInfos(url, 1))[0].id
    const movieInfos = await getFullMovieInfos(`http://localhost:8000/api/v1/titles/${id}`)
    return movieInfos
}


// Nettoyage et récupération de toutes les informations d'un film selon une requete sur l'API
async function getFullMovieInfos(url) {
    const data = await getData(url)
    let rated = ""
    if (/\d/.test(data.rated)){
        age = data.rated.replace(/\D+/g, "")
        rated = "PG-" + age
    } else {
        rated = "Classification inconnue"
    }
    let grossIncome = ""
    if (data.worldwide_gross_income){
        grossIncome = "$" + Number((data.worldwide_gross_income / 1000000).toFixed(1)) + "m"
    } else {
        grossIncome = "Inconnu"
    }
    let movieInfos = {
        id: data.id,
        title: data.original_title,
        summary: data.description,
        longSummary: data.long_description,
        imageUrl: data.image_url,
        year: data.year,
        genres: data.genres.join(", "), 
        rated: rated,
        duration: data.duration,
        countries: data.countries.join(" / "), 
        imdbScore: data.imdb_score + "/10",
        grossIncome: grossIncome,
        directors: data.directors.join(", "),
        actors: data.actors.join(", ")
    }
    return movieInfos
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


// Alimenter le code XML qui compose la section des meilleurs films (toute catégories) via l'API
async function feedBestMovies(nbMovies) {
    const urlFilterBestMovies = `http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=${nbMovies+1}`
    const moviesInfos = await getMoviesInfos(urlFilterBestMovies, nbMovies+1)
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


// Alimenter les données de la section du meilleur film via l'API
async function feedBestMovie() {
    const urlFilterBestMovies = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score"
    let movieInfos = await getInfosFromFirstId(urlFilterBestMovies)
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


// Récupérer la liste de toutes les categories de l'API
async function getCategories() {
    const data = await getData("http://localhost:8000/api/v1/genres/?page_size=25")
    const categories = []
    for (let i = 0; i < data.results.length; i++) {
        categories.push(data.results[i].name) 
    }
    return categories
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


// Ecouter le changement d'un choix dans la liste des catégories
async function initChosenCategory(nbMovies) {
    const tagCategoryChoice = document.getElementById("listCategory")
    await feedBestMoviesInCategory(tagCategoryChoice.value, "otherCategory", nbMovies)
    tagCategoryChoice.addEventListener("change", async (event) => {
        const oldMoviesCategory = document.querySelector(".categoryChosen")
        oldMoviesCategory.remove()
        await feedBestMoviesInCategory(event.target.value, "otherCategory", nbMovies)
        initDetailsButtons()
        initSeeMoreLessBtns()
    })
}


// Ecouter le click sur le bouton fermer pour fermer la fenetre modale
function initCloseBtnModalWindow() {
    const tagCloseButton = document.getElementById("closeBtn")
    const tagModalWindowBg = document.getElementById("modalWindowBackground")
    tagCloseButton.addEventListener("click", () => {
        tagModalWindowBg.classList.add("hide")
    })
}


// Afficher la fenetre modale
function displayModalWindow() {
    const tagModalWindowBg = document.getElementById("modalWindowBackground")
    tagModalWindowBg.classList.remove("hide")
    initCloseBtnModalWindow()
    
}


// Ecouter le click sur l'un des boutons détails pour ouvrir la fenetre modale
function initDetailsButtons() {
    document.querySelectorAll(".detailsButton").forEach((btn) => { 
        btn.addEventListener("click", async (event) => {
            let url = `http://localhost:8000/api/v1/titles/${event.target.dataset.id}`
            await feedModalWindow(url)
            displayModalWindow()
    })})

}


// Ecouter le click sur l'un des boutons voir plus/moins pour afficher/cacher les films d'une catégorie
function initSeeMoreLessBtns() {
    document.querySelectorAll(".seeBtn").forEach((btn) => { 
        hideMoviesInCategory(btn.dataset.section)
        btn.onclick = () => {
            if (btn.dataset.see === "more") {
                //aficher tous les films de la categorie
                unHideMoviesInCategory(btn.dataset.section)
                btn.dataset.see = "less"
                btn.textContent = "Voir moins"
            } else {
                //cacher les films de la categorie selon taille d'ecran
                hideMoviesInCategory(btn.dataset.section)
                btn.dataset.see = "more"
                btn.textContent = "Voir plus"
            }
        }
    })
}


// Cacher un nombre de films d'une catégorie en fonction de la largeur de la fenetre
function hideMoviesInCategory(section) {
    const movies = document.querySelectorAll(`#${section} .movieCard`)
    const width = document.documentElement.clientWidth
    let nbVisibleMovies
    switch (true) {
        case width < 426:
            nbVisibleMovies = 2
            break
        case width < 769:
            nbVisibleMovies = 4
            break
        default:
            nbVisibleMovies = 6
    }
    for (let i = 0; i < movies.length; i++) {
        if (i >= nbVisibleMovies) {
            movies[i].classList.add("hide")
        } else {
            movies[i].classList.remove("hide")
        }
    }
}


// Afficher tous les films d'une catégorie
function unHideMoviesInCategory(section) {
    document.querySelectorAll(`#${section} .movieCard`).forEach((card) => {
        card.classList.remove("hide")
    })
}


// Ecouter les changement de dimension de la fenetre
function initResizingWindow() {
    window.addEventListener("resize", initSeeMoreLessBtns);
}






async function feedHtml(){
    
    await feedBestMovie()
    await feedBestMovies(nbMoviesInCategory)

    await feedBestMoviesInCategory(firstCategory, "firstCategory", nbMoviesInCategory)
    await feedBestMoviesInCategory(secondCategory, "secondCategory", nbMoviesInCategory)

    const categories = await getCategories()
    displayCategoriesChoice(categories)

    await initChosenCategory(nbMoviesInCategory)


    
    initDetailsButtons()
    initSeeMoreLessBtns()
    
    
    initResizingWindow()

}



feedHtml()
    


