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


// Récupérer la liste de toutes les categories de l'API
async function getCategories() {
    const data = await getData("http://localhost:8000/api/v1/genres/?page_size=25")
    const categories = []
    for (let i = 0; i < data.results.length; i++) {
        categories.push(data.results[i].name) 
    }
    return categories
}