import { Anime } from "../model/animeModel.js";
import { AnimeMystere } from "../model/mystereModel.js";

let liste_anime = []
let anime_mystere;
let nb_citation = 1;

export async function searchFav() {
    if (localStorage.getItem("anime_fav") != null) {
        document.getElementById("liste_anime").innerHTML = "";
        let anime_array = localStorage.getItem("anime_fav").split(",")
    }
}

/**
 * Recherche un anime par nom
 * @param {String} search_word 
 */
export async function searchList(search_word) {
    document.getElementById("liste_anime").style.display = "";
    document.getElementById("presentation").style.display = "none";
    document.getElementById("liste_anime").innerHTML = "";
    const response = await fetch('https://api.jikan.moe/v4/anime?q=' + search_word);
    const animes = await response.json();
    document.getElementById("info").style.display = "none"
    animes.data.forEach(element => {
        liste_anime.push(new Anime(element.mal_id, element.title, element.images.jpg.image_url, element.trailer.embed_url, element.synopsis, element.episodes, element.score, element.url))
        let html = `<div class="anime_main">
            <img src="${localStorage.getItem(element.title) != null ? "./img/fav_on.png" : "./img/fav_off.png"}" class="fav_anime" id="${element.title}">
            <div class="anime_div" id="${element.mal_id}")">
            <img src="${element.images.jpg.image_url}" alt="img">
            <h4 translate="no">${element.title}</h4>
            </div>
        </div>`
        document.getElementById("liste_anime").insertAdjacentHTML("beforeend", html)
    });
    // ajout des EventListener
    Array.from(document.getElementsByClassName("anime_div")).forEach(function (element) {
        element.addEventListener('click', function (e) {
            showInfoPresentation(e.path[1].id);
        });
    });
    Array.from(document.getElementsByClassName("fav_anime")).forEach(function (element) { // Partie Favoris
        element.addEventListener('click', function (e) {
            if (e.path[0].src.includes("fav_off.png")) {
                if (localStorage.getItem("anime_fav") == null) {
                    let array_anime;
                    liste_anime.forEach(element => {
                        if (element.title == e.path[0].id) {
                            array_anime = element
                        }
                    });
                    localStorage.setItem("anime_fav", array_anime)
                } else {
                    let array_anime = localStorage.getItem("anime_fav").split(",")
                    array_anime.push(e.path[0].id)
                    localStorage.setItem("anime_fav", array_anime)
                }
                localStorage.setItem(e.path[0].id, "fav")
                e.path[0].src = "./img/fav_on.png"
            } else {
                localStorage.removeItem(e.path[0].id)
                let array_anime = localStorage.getItem("anime_fav").split(",")
                let index = array_anime.indexOf(e.path[0].id);
                if (index !== -1) {
                    array_anime.splice(index, 1)
                    localStorage.setItem("anime_fav", array_anime)
                }
                e.path[0].src = "./img/fav_off.png"
            }

        });
    });
}

/**
 * Afficher info détaillé anime
 * @param {int} anime_id 
 */
function showInfoPresentation(anime_id) {
    if (document.getElementById("liste_anime") != null) {
        document.getElementById("liste_anime").style.display = "none";
    }
    let show_anime;
    liste_anime.forEach(element => {
        if (element.id == anime_id) {
            show_anime = element
        }
    });
    document.getElementById("img_anime").src = show_anime.img_url
    document.getElementById("anime_name").innerHTML = show_anime.name
    document.getElementById("presentation").style.display = "";

    let star_note = show_anime.note / 10 * 5;
    let star = document.getElementById("star");

    if (star_note > 4.5) {
        star.src = "./img/star_5.png"
    } else if (star_note > 3.5) {
        star.src = "./img/star_4.png"
    } else if (star_note > 2.5) {
        star.src = "./img/star_3.png"
    } else if (star_note > 1.5) {
        star.src = "./img/star_2.png"
    } else {
        star.src = "./img/star_1.png"
    }

    document.getElementById("anime_url").href = show_anime.detail_url

    let html = `
        <p>Nombres d'épisodes : ${show_anime.episodes}</p>
        <p>Synopsis : ${show_anime.synopsis}</p>
        <div id="anime_video">
            <iframe width="512" height="288" src="${show_anime.trailer_url}">
            </iframe>
        </div>
    `

    document.getElementById("right_index").innerHTML = html
}



/**
 * Chargement d'une citation et d'un anime au hasard
 */
export async function loadCitation() {
    const response = await fetch('https://animechan.vercel.app/api/random');
    const data = await response.json();
    anime_mystere = new AnimeMystere(data.anime, data.character, data.quote)
    console.log(anime_mystere);
    document.getElementById("citation_1").innerHTML = `"${data.quote}"`
    document.getElementById("more_citation").addEventListener('click', function (e) {
        moreCitation();
    });
    document.getElementById("abandon").addEventListener('click', function (e) {
        searchMystereAnime();
    });
    document.getElementById("valid_answer").addEventListener('click', function (e) {
        validMystere();
    });
}

/**
 * Recherche d'une nouvelle citation
 */
async function moreCitation() {
    if (nb_citation < 5) {
        nb_citation++;
        document.getElementById(`citation_${nb_citation}_div`).style.display = "";
        let data;
        do {
            const response = await fetch('https://animechan.vercel.app/api/quotes/anime?title=' + anime_mystere.name);
            data = await response.json();
        } while (data.length < 5); // Si l'anime n'a pas plus de 4 Citations

        let citation = `"${data[Math.floor(Math.random() * data.length)].quote}"`

        // Si la citation est identique au précédente
        while (citation == document.getElementById(`citation_1`).innerHTML ||
            citation == document.getElementById(`citation_2`).innerHTML ||
            citation == document.getElementById(`citation_3`).innerHTML ||
            citation == document.getElementById(`citation_4`).innerHTML) {
            citation = `"${data[Math.floor(Math.random() * data.length)].quote}"`
        }

        document.getElementById(`citation_${nb_citation}`).innerHTML = citation

        if (nb_citation >= 5) {
            document.getElementById("more_citation").innerHTML = "Une image ?";
        }

    } else if (nb_citation == 5) {
        nb_citation++;
        const response = await fetch('https://api.jikan.moe/v4/anime?q=' + anime_mystere.name); // recherche de l'image correspondante
        const animes = await response.json();
        document.getElementById("anime_img").src = animes.data[0].images.jpg.image_url
        document.getElementById("more_citation").innerHTML = "La Réponse ?";
    } else {
        searchMystereAnime()
    }
}

/**
 * Rechercher l'anime mystere
 */
async function searchMystereAnime() {
    document.getElementById("presentation_mystere").style.display = "none";
    const response = await fetch('https://api.jikan.moe/v4/anime?q=' + anime_mystere.name);
    const animes = await response.json();
    let element = animes.data[0]
    liste_anime.push(new Anime(element.mal_id, element.title, element.images.jpg.image_url, element.trailer.embed_url, element.synopsis, element.episodes, element.score, element.url))
    showInfoPresentation(element.mal_id);
}

/**
 * Valider la réponse de l'anime mystère
 */
function validMystere() {
    if (document.getElementById("name_anime").value.toLowerCase() == anime_mystere.name.toLowerCase() || (anime_mystere.name.toLowerCase().includes(document.getElementById("name_anime").value.toLowerCase()) && document.getElementById("name_anime").value.length > 4)) {
        document.getElementById("result_game").innerHTML = "Bravo !"
        document.getElementById("result_game").style.color = "green"
        searchMystereAnime()
    } else {
        document.getElementById("name_anime").value = ""
        document.getElementById("name_anime").style.border = "1px solid red"
    }
}