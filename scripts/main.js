// Point d'entrée de l'app
async function main() {    
    await initChosenCategory(nbMoviesInCategory)
    initDetailsButtons()
    initSeeMoreLessBtns()
    initResizingWindow()

    displayCategoriesChoice(await getCategories())
    await feedBestMovie()
    await feedBestMovies(nbMoviesInCategory)
    await feedBestMoviesInCategory(firstCategory, "firstCategory", nbMoviesInCategory)
    await feedBestMoviesInCategory(secondCategory, "secondCategory", nbMoviesInCategory)
}

main()