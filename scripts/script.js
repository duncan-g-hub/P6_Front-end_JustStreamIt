
    
async function getData(url) {
    const response = await fetch(url)
    const data = await response.json()
    return data
}


async function getMovieIds(url, nbMovieIds) {
    const data = await getData(url)
    const ids = []

    const max = Math.min(nbMovieIds, data.results.length)
    for (let i = 0; i < max; i++) {
        ids.push(data.results[i].id)
    }
    return ids 

}


async function getInfosFromIds(ids) {
    const moviesInfos = []
    for (i = 0; i < ids.length; i++) {
        const urlId = `http://localhost:8000/api/v1/titles/${ids[i]}`
        moviesInfos.push(await getMovieInfos(urlId))
    }
    return moviesInfos
}


async function getInfosFromFirstId(url) {
    const ids = await getMovieIds(url, 1)
    const movieInfos = await getMovieInfos(`http://localhost:8000/api/v1/titles/${ids[0]}`)
    return movieInfos
}


async function getMovieInfos(url) {
    const data = await getData(url)

    let rated = ""
    if (data.rated === "Not rated or unkown rating"){
        rated = "Classification inconnue"
    } else {
        rated = data.rated
    }
    let grossIncome = ""
    if (data.worldwide_gross_income){
        grossIncome = data.worldwide_gross_income
    } else {
        grossIncome = "Inconnu"
    }
    
    let movieInfos = {
        title: data.original_title,
        summary: data.description,
        longSummary: data.long_description,
        imageUrl: data.image_url,
        year: data.year,
        genres: data.genres.join(", "), 
        rated: rated,
        duration: data.duration,
        countries: data.countries.join(", "), 
        imdbScore: data.imdb_score,
        grossIncome: grossIncome,
        directors: data.directors.join(", "),
        actors: data.actors.join(", ")
    }
    return movieInfos
}


function setAlternativeImage(tagImage, urlImage) {
    tagImage.onerror = () => {
        tagImage.onerror = null
        tagImage.src = "https://picsum.photos/360/480"
        }
    tagImage.src = urlImage
}


async function feedBestMoviesInCategory(categoryName, whereToAdd, nbMovies) {
    const urlFilterBestMoviesInCategory = `http://localhost:8000/api/v1/titles?sort_by=-imdb_score&genre=${categoryName}&page_size=${nbMovies}`
    const ids = await getMovieIds(urlFilterBestMoviesInCategory, nbMovies)
    const moviesInfos = await getInfosFromIds(ids)
    const tagBestMoviesInCategory = document.getElementById(`${whereToAdd}`)
    if (whereToAdd === "otherCategory") {
        tagBestMoviesInCategory.insertAdjacentHTML("beforeend", 
        `<div id="${categoryName}Category" class="categoryChosen">
            <div id="${categoryName}MoviesFrame" class="moviesFrame"></div>
            <button class="hide seeMore" id="seeBtn" >Voir plus</button>
        </div>`)   
    } else {
        tagBestMoviesInCategory.insertAdjacentHTML("beforeend", 
        `<div id="${categoryName}Category">
            <h2>${categoryName}</h2>
            <div id="${categoryName}MoviesFrame" class="moviesFrame"></div>
            <button class="hide seeMore" id="seeBtn" >Voir plus</button>
        </div>`)   
    }
    for (i = 0; i < moviesInfos.length; i++){
        let categoryMoviesFrameContent = `
                <div id="movieCard" class="image${i}">
                    <img src="" alt="">
                    <div id="movieBanner">
                        <h3 id="movieTitle">${moviesInfos[i].title}</h3>
                        <button class="detailsButton" id="detailsGreyButton">Détails</button>
                    </div>
                </div>`
        let tagMoviesFrame = document.querySelector(`#${whereToAdd} #${categoryName}MoviesFrame`)
        tagMoviesFrame.insertAdjacentHTML("beforeend", categoryMoviesFrameContent)
        
        let tagImage = document.querySelector(`#${whereToAdd} #${categoryName}MoviesFrame .image${i} img`)
        setAlternativeImage(tagImage, moviesInfos[i].imageUrl)
        tagImage.alt = moviesInfos[i].title + " image"
    }
}



async function feedBestMovies(nbMovies) {
    const urlFilterBestMovies = `http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=${nbMovies+1}`
    const ids = await getMovieIds(urlFilterBestMovies, nbMovies+1)
    const moviesInfos = await getInfosFromIds(ids)
    for (i = 1; i < moviesInfos.length; i++){
        let bestMoviesFrameContent = `
                <div id="movieCard" class="image${i}">
                    <img src="" alt="">
                    <div id="movieBanner">
                        <h3 id="movieTitle">${moviesInfos[i].title}</h3>
                        <button class="detailsButton" id="detailsGreyButton">Détails</button>
                    </div>
                </div>`
        let tagMoviesFrame = document.querySelector("#bestMoviesFrame")
        tagMoviesFrame.insertAdjacentHTML("beforeend", bestMoviesFrameContent)

        let tagImage = document.querySelector(`.image${i} img`)
        setAlternativeImage(tagImage, moviesInfos[i].imageUrl)
        tagImage.alt = moviesInfos[i].title + " image"
    }
}



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
}



async function feedModalWindow() {
    const urlFilterBestMovies = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score"
    let movieInfos = await getInfosFromFirstId(urlFilterBestMovies)

    const tagTitle = document.querySelector("#modalWindow #infos h2")
    tagTitle.textContent = movieInfos.title

    const tagInfos = document.querySelector("#modalWindow #infos h3")
    tagInfos.innerHTML = `${movieInfos.year} - ${movieInfos.genres} <br>${movieInfos.rated} - ${movieInfos.duration}minutes (${movieInfos.countries}) <br>Score IMDB : ${movieInfos.imdbScore} <br>Recettes au box-office : ${movieInfos.grossIncome}`

    const tagDirectors = document.querySelector("#modalWindow #infos #directors")
    tagDirectors.textContent = movieInfos.directors

    const tagSummary = document.querySelector("#modalWindow #infos #summary")
    tagSummary.textContent = movieInfos.longSummary

    const tagActors = document.querySelector("#modalWindow #infos #actors")
    tagActors.textContent = movieInfos.actors

    const tagImage = document.querySelector("#poster img")
    setAlternativeImage(tagImage, movieInfos.imageUrl)
    tagImage.alt = movieInfos.title + " image"
}


async function getCategories() {
    const data = await getData("http://localhost:8000/api/v1/genres/?page_size=25")
    const categories = []
    for (let i = 0; i < data.results.length; i++) {
        categories.push(data.results[i].name) 
    }
    return categories
}


function displayCategoriesChoice(categories) {
    const tagCategoryChoice = document.getElementById("listCategory")
    for (i = 0; i < categories.length; i++) {
        tagCategoryChoice.insertAdjacentHTML("beforeend", 
            `<option value="${categories[i]}">${categories[i]}</option>`
        )
    }

}


async function initChosenCategory(nbMovies) {
    const tagCategoryChoice = document.getElementById("listCategory")
    await feedBestMoviesInCategory(tagCategoryChoice.value, "otherCategory", nbMovies)

    tagCategoryChoice.addEventListener("change", async () => {
        const chosenCategory = tagCategoryChoice.value

        const oldMoviesCategory = document.querySelector(".categoryChosen")
        oldMoviesCategory.remove()

        await feedBestMoviesInCategory(chosenCategory, "otherCategory", nbMovies)
    })
}


async function feedHtml(){
    const nbMoviesInCategory = 6
    await feedBestMovie()
    await feedBestMovies(nbMoviesInCategory)


    await feedBestMoviesInCategory("Sci-Fi", "firstCategory", nbMoviesInCategory)
    await feedBestMoviesInCategory("Adventure", "secondCategory", nbMoviesInCategory)

    const categories = await getCategories()
    displayCategoriesChoice(categories)

    initChosenCategory(nbMoviesInCategory)


    await feedModalWindow()


}



feedHtml()
    


