
    
async function getData(url) {
    const response = await fetch(url)
    const data = await response.json()
    return data
}



async function getMovieIds(url, nbMovieIds) {
    const data = await getData(url)
    let ids = []
    for (let i = 0; i < nbMovieIds; i++) {
        ids.push(data.results[i].id)
    }
    return ids 
}


async function getInfosFromIds(ids) {
    let moviesInfos = []
    for (i = 0; i < ids.length; i++) {
        const urlId = `http://localhost:8000/api/v1/titles/${ids[i]}`
        moviesInfos.push(await getMovieInfos(urlId))
    }
    return moviesInfos
}



async function feedBestMoviesInOtherCategory(categoryName) {
    const urlFilterBestMoviesInCategory = `http://localhost:8000/api/v1/titles?sort_by=-imdb_score&genre=${categoryName}&page_size=6`
    const ids = await getMovieIds(urlFilterBestMoviesInCategory, 6)
    const moviesInfos = await getInfosFromIds(ids)

    const tagBestMoviesInCategory = document.getElementById("otherCategory")
    tagBestMoviesInCategory.insertAdjacentHTML("beforeend", 
        `<div id="${categoryName}Category">
            <div id="${categoryName}MoviesFrame" class="moviesFrame"></div>
            <button class="hide seeMore" id="seeBtn" >Voir plus</button>
        </div>`)    

    for (i = 0; i < moviesInfos.length; i++){
        let categoryMoviesFrameContent = `
                <div id="movieCard" class="image${i}">
                    <img src="" alt="">
                    <div id="movieBanner">
                        <h3 id="movieTitle">${moviesInfos[i].title}</h3>
                        <button class="detailsButton" id="detailsGreyButton">Détails</button>
                    </div>
                </div>`
        let tagMoviesFrame = document.querySelector(`#${categoryName}MoviesFrame`)
        tagMoviesFrame.insertAdjacentHTML("beforeend", categoryMoviesFrameContent)

        const tagImage = document.querySelector(`#${categoryName}MoviesFrame .image${i} img`)
        tagImage.onerror = () => {
        tagImage.onerror = null
        tagImage.src = "https://picsum.photos/360/480"
        }
        tagImage.src = moviesInfos[i].imageUrl
        tagImage.alt = moviesInfos[i].title + " image"
    }
}



async function feedBestMoviesInCategory(categoryName) {
    const urlFilterBestMoviesInCategory = `http://localhost:8000/api/v1/titles?sort_by=-imdb_score&genre=${categoryName}&page_size=6`
    const ids = await getMovieIds(urlFilterBestMoviesInCategory, 6)
    const moviesInfos = await getInfosFromIds(ids)

    const tagBestMoviesInCategory = document.getElementById("bestMoviesInCategory")
    tagBestMoviesInCategory.insertAdjacentHTML("beforeend", 
        `<div id="${categoryName}Category">
            <h2>${categoryName}</h2>
            <div id="${categoryName}MoviesFrame" class="moviesFrame"></div>
            <button class="hide seeMore" id="seeBtn" >Voir plus</button>
        </div>`)    

    for (i = 0; i < moviesInfos.length; i++){
        let categoryMoviesFrameContent = `
                <div id="movieCard" class="image${i}">
                    <img src="" alt="">
                    <div id="movieBanner">
                        <h3 id="movieTitle">${moviesInfos[i].title}</h3>
                        <button class="detailsButton" id="detailsGreyButton">Détails</button>
                    </div>
                </div>`
        let tagMoviesFrame = document.querySelector(`#${categoryName}MoviesFrame`)
        tagMoviesFrame.insertAdjacentHTML("beforeend", categoryMoviesFrameContent)

        const tagImage = document.querySelector(`#${categoryName}MoviesFrame .image${i} img`)
        tagImage.onerror = () => {
        tagImage.onerror = null
        tagImage.src = "https://picsum.photos/360/480"
        }
        tagImage.src = moviesInfos[i].imageUrl
        tagImage.alt = moviesInfos[i].title + " image"
    }
}






async function feedBestMovies() {
    const urlFilterBestMovies = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=7"
    const ids = await getMovieIds(urlFilterBestMovies, 7)
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

        const tagImage = document.querySelector(`.image${i} img`)
        tagImage.onerror = () => {
        tagImage.onerror = null
        tagImage.src = "https://picsum.photos/360/480"
        }
        tagImage.src = moviesInfos[i].imageUrl
        tagImage.alt = moviesInfos[i].title + " image"
    }
}









async function getInfosFromFirstId(url) {
    let ids = await getMovieIds(url, 1)
    let id = ids[0]

    const urlFirstId = `http://localhost:8000/api/v1/titles/${id}`
    let movieInfos = await getMovieInfos(urlFirstId)
    return movieInfos
}



async function feedBestMovie() {
    const urlFilterBestMovies = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score"
    let movieInfos = await getInfosFromFirstId(urlFilterBestMovies)
    
    const tagTitle = document.querySelector("#movieContent h2")
    tagTitle.textContent = movieInfos.title

    const tagSummary = document.querySelector("#movieContent p")
    tagSummary.textContent = movieInfos.summary

    const tagImage = document.querySelector("#movieImage img")
    tagImage.onerror = () => {
    tagImage.onerror = null
    tagImage.src = "https://picsum.photos/360/480"
    }
    tagImage.src = movieInfos.imageUrl
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
    tagImage.onerror = () => {
    tagImage.onerror = null
    tagImage.src = "https://picsum.photos/360/480"
    }
    tagImage.src = movieInfos.imageUrl
    tagImage.alt = movieInfos.title + " image"
}






async function getMovieInfos(url) {
    const data = await getData(url)

    let title = data.original_title
    let summary = data.description
    let longSummary = data.long_description
    let imageUrl = data.image_url
    let year = data.year
    let genres = data.genres.join(", ")

    let rated = ""
    if (data.rated === "Not rated or unkown rating"){
        rated = "Classification inconnue"
    } else {
        rated = data.rated
    }

    let duration = data.duration
    let countries = data.countries.join(", ")
    let imdbScore = data.imdb_score

    let grossIncome = ""
    if (data.worldwide_gross_income){
        grossIncome = data.worldwide_gross_income
    } else {
        grossIncome = "Inconnu"
    }

    let directors = data.directors.join(", ")
    let actors = data.actors.join(", ")

    
    let movieInfos = {
        title: title,
        summary: summary,
        longSummary: longSummary,
        imageUrl: imageUrl,
        year: year,
        genres: genres, 
        rated: rated,
        duration: duration,
        countries: countries, 
        imdbScore: imdbScore,
        grossIncome:grossIncome,
        directors: directors,
        actors: actors
    }
    return movieInfos
}







async function feedHtml(){
    await feedBestMovie()
    await feedBestMovies()
    await feedModalWindow()
    await feedBestMoviesInCategory("Sci-Fi")
    await feedBestMoviesInCategory("Adventure")




    await feedBestMoviesInOtherCategory("Comedy")
}



feedHtml()
    


