
    
async function getData(url) {
    const response = await fetch(url)
    const data = await response.json()
    return data
}

async function getMovieId(url) {
    const data = await getData(url)
    let id = data.results[0].id
    return id
}

async function getMovieInfo(url) {
    const data = await getData(url)
    let title = data.title
    let summary = data.description
    let imageUrl = data.image_url

    let infos = {
        title: title,
        summary: summary,
        imageUrl: imageUrl
    }
    return infos
}


async function feedBestMovie() {
    const urlFilterBestMovie = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score"
    let id = await getMovieId(urlFilterBestMovie)

    const urlBestMovie = `http://localhost:8000/api/v1/titles/${id}`
    let infos = await getMovieInfo(urlBestMovie)

    console.log(infos.title)
    
    const tagTitle = document.querySelector("#movieContent h2")
    tagTitle.textContent = infos.title

    const tagSummary = document.querySelector("#movieContent p")
    tagSummary.textContent = infos.summary

    const tagImage = document.querySelector("#movieImage img")
    tagImage.onerror = () => {
    tagImage.src = "https://picsum.photos/240/320"
}
    tagImage.src = infos.imageUrl
    tagImage.alt = infos.title + " image"
}

feedBestMovie()
