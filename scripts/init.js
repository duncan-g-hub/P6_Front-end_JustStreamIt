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
        btn.onclick = () => {
            if (btn.dataset.see === "more") {
                //aficher tous les films de la categorie
                showMoviesInCategory(btn.dataset.section)
                btn.dataset.see = "less"
                btn.textContent = "Voir moins"
            } else {
                //cacher les films de la categorie selon Querries CSS
                hideMoviesInCategory(btn.dataset.section)
                btn.dataset.see = "more"
                btn.textContent = "Voir plus"
            }
        }
    })
}


