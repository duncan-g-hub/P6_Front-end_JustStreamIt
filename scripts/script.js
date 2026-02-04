
    
async function getData(url) {
    const response = await fetch(url)
    const data = await response.json()
    return data
}


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


async function getInfosFromFirstId(url) {
    const id = (await getMoviesInfos(url, 1))[0].id
    const movieInfos = await getFullMovieInfos(`http://localhost:8000/api/v1/titles/${id}`)
    return movieInfos
}


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


function setAlternativeImage(tagImage, urlImage) {
    tagImage.onerror = () => {
        tagImage.onerror = null
        tagImage.src = "https://picsum.photos/360/480"
        }
    tagImage.src = urlImage
}


async function feedBestMoviesInCategory(categoryName, whereToAdd, nbMovies) {
    const urlFilterBestMoviesInCategory = `http://localhost:8000/api/v1/titles?sort_by=-imdb_score&genre=${categoryName}&page_size=${nbMovies}`
    const moviesInfos = await getMoviesInfos(urlFilterBestMoviesInCategory, nbMovies)
    const tagBestMoviesInCategory = document.getElementById(`${whereToAdd}`)
    if (whereToAdd === "otherCategory") {
        tagBestMoviesInCategory.insertAdjacentHTML("beforeend", 
        `<div id="${categoryName}Category" class="categoryChosen">
            <div id="${categoryName}MoviesFrame" class="moviesFrame"></div>
            <button class="hide seeBtn" >Voir plus</button>
        </div>`)   
    } else {
        tagBestMoviesInCategory.insertAdjacentHTML("beforeend", 
        `<div id="${categoryName}Category">
            <h2>${categoryName}</h2>
            <div id="${categoryName}MoviesFrame" class="moviesFrame"></div>
            <button class="hide seeBtn" >Voir plus</button>
        </div>`)   
    }
    for (i = 0; i < moviesInfos.length; i++){
        let categoryMoviesFrameContent = `
                <div id="image${i}" class="movieCard">
                    <img src="" alt="">
                    <div class="movieBanner">
                        <h3 class="movieTitle">${moviesInfos[i].title}</h3>
                        <button class="detailsButton detailsCardButton" data-id="${moviesInfos[i].id}">Détails</button>
                    </div>
                </div>`
        let tagMoviesFrame = document.querySelector(`#${whereToAdd} #${categoryName}MoviesFrame`)
        tagMoviesFrame.insertAdjacentHTML("beforeend", categoryMoviesFrameContent)
        
        let tagImage = document.querySelector(`#${whereToAdd} #${categoryName}MoviesFrame #image${i} img`)
        setAlternativeImage(tagImage, moviesInfos[i].imageUrl)
        tagImage.alt = moviesInfos[i].title + " image"
    }
}



async function feedBestMovies(nbMovies) {
    const urlFilterBestMovies = `http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=${nbMovies+1}`
    const moviesInfos = await getMoviesInfos(urlFilterBestMovies, nbMovies+1)
    for (i = 1; i < moviesInfos.length; i++){
        let bestMoviesFrameContent = `
                <div id="image${i}" class="movieCard">
                    <img src="" alt="">
                    <div class="movieBanner">
                        <h3 class="movieTitle">${moviesInfos[i].title}</h3>
                        <button class="detailsButton detailsCardButton" data-id="${moviesInfos[i].id}">Détails</button>
                    </div>
                </div>`
        let tagMoviesFrame = document.querySelector("#bestMoviesFrame")
        tagMoviesFrame.insertAdjacentHTML("beforeend", bestMoviesFrameContent)

        let tagImage = document.querySelector(`#image${i} img`)
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

    const tagButton = document.querySelector("#movieContent button")
    tagButton.dataset.id = movieInfos.id
}



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
    initDetailsButtons()
    tagCategoryChoice.addEventListener("change", async (event) => {
        const oldMoviesCategory = document.querySelector(".categoryChosen")
        oldMoviesCategory.remove()

        await feedBestMoviesInCategory(event.target.value, "otherCategory", nbMovies)

        initDetailsButtons()
    })
}


function closeModalWindow() {
    const tagCloseButton = document.getElementById("closeBtn")
    const tagModalWindowBg = document.getElementById("modalWindowBackground")
    tagCloseButton.addEventListener("click", () => {
        tagModalWindowBg.classList.add("hide")
    })
}


function displayModalWindow() {
    const tagModalWindowBg = document.getElementById("modalWindowBackground")
    tagModalWindowBg.classList.remove("hide")
    closeModalWindow()
    
}


function initDetailsButtons() {
    const tagsDetailsButtons = document.querySelectorAll(".detailsButton")
    for (let i = 0; i < tagsDetailsButtons.length; i++){
        tagsDetailsButtons[i].addEventListener("click", async (event) => {
            let url = `http://localhost:8000/api/v1/titles/${event.target.dataset.id}`
            await feedModalWindow(url)
            displayModalWindow()
        })
    }
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

    initDetailsButtons()

}



feedHtml()
    


