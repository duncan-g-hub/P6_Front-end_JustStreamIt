async function main() {


    
    async function getData(url) {
        const response = await fetch(url)
        const data = await response.json()
        return data
    }

    const url = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score"
    const data = await getData(url)

    console.log(data.results[0].title)
    


}

main()
