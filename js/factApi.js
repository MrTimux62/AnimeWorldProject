import { Anime_fact } from "../model/factModel.js";

let liste_anime_fact = []

/**
 * Chargement de la liste des Faits
 */
 export async function loadFact() {
    const response = await fetch('https://anime-facts-rest-api.herokuapp.com/api/v1');
    const animes = await response.json();
    animes.data.forEach(element => {
        let html = `<div class="anime_div" id="${element.anime_name}" ">
            <img src="${element.anime_img}" alt="${element.anime_name}_img">
            <h4 translate="no">${element.anime_name}</h4>
        </div>`

        liste_anime_fact.push(new Anime_fact(element.anime_id, element.anime_name, element.anime_img))

        document.getElementById("liste_anime").insertAdjacentHTML("beforeend", html)
    });

    Array.from(document.getElementsByClassName("anime_div")).forEach(function (element) {
        element.addEventListener('click', function (e) {
            showInfoFact(e.path[1].id);
        });
    });

}


/**
 * Afficher info détaillé des Faits
 * @param {String} anime_name 
 */
 async function showInfoFact(anime_name) {
    document.getElementById("liste_anime").style.display = "none";
    const response = await fetch('https://anime-facts-rest-api.herokuapp.com/api/v1/' + anime_name);
    const animes = await response.json();
    let img_url;
    document.getElementById("fait").innerHTML = ""
    document.getElementById("fait").insertAdjacentHTML("beforeend", "<h3>Fait surprenant !</h3>");
    animes.data.forEach(element => {
        document.getElementById("fait").insertAdjacentHTML("beforeend", `<p>${element.fact}</p><hr>`)
    });
    liste_anime_fact.forEach(anime => {
        if (anime.name == anime_name) {
            img_url = anime.img_url;
        }
    });
    document.getElementById("img_anime").src = img_url
    document.getElementById("img_anime").alt = `${anime_name}_img`
    document.getElementById("anime_name").innerHTML = anime_name
    document.getElementById("presentation").style.display = "";
}