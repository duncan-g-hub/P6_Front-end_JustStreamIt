// Point d'entrée de l'application



async function main() {    
    displayCategoriesChoice(await getCategories())
    await feedBestMovies(nbMoviesInCategory)
    await feedBestMoviesInCategory(firstCategory, "firstCategory", nbMoviesInCategory)
    await feedBestMoviesInCategory(secondCategory, "secondCategory", nbMoviesInCategory)

    await initChosenCategory(nbMoviesInCategory)
    initDetailsButtons()
    initSeeMoreLessBtns()
}

main()