import { loadCitation, searchList, searchFav } from "./searchApi.js";
import { loadSelect } from "./reactionApi.js";
import { loadFact } from "./factApi.js";

const header = document.getElementsByTagName('header')[0];

/**
 * Chargement des api selon la page
 */
window.onload = function () {
    if (window.location.href.indexOf('reaction_anime') > -1) { // Chargement des Réactions
        loadSelect();
    } else if (window.location.href.indexOf('fact_anime') > -1) { // Chargement des Facts
        loadFact()
    } else if (window.location.href.indexOf('citation_anime') > -1) { // Chargement des Citations
        loadCitation()
    } else if (window.location.href.indexOf('search_anime') > -1) { // Chargement des Anime
        searchList("")
    }
}

/**
 * Couleur au scroll
 */
window.addEventListener('scroll', function (e) {
    if (window.scrollY > 0) {
        header.style.backgroundColor = "rgb(74, 21, 100, 0.9)";
    } else {
        header.style.backgroundColor = "transparent";
    }
});

/**
 * Afficher liste
 */
if (document.getElementById("retour") != null) {
    document.getElementById("retour").addEventListener("click", function (e) {
        document.getElementById("liste_anime").style.display = "";
        document.getElementById("presentation").style.display = "none";
    });
}


/**
 * Recherche d'anime
 */
if (document.getElementById("search_list_button") != null) {
    document.getElementById("search_list_button").addEventListener("click", function (e) {
        document.getElementById("info").innerHTML = "Recherche en cours..."
        searchList(document.getElementById("search_anime").value);
    })
    
}

/**
 * Afficher Fav Button
 */
if (document.getElementById("search_fav") != null) {
    document.getElementById("search_fav").addEventListener("click", function (e) {
        searchFav()
    });
}
