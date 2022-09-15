/**
 * Chargement des différentes réactions
 */
export async function loadSelect() {
    const response = await fetch('https://api.otakugifs.xyz/gif/allreactions');
    const data = await response.json();
    data.reactions.forEach(element => {
        let html = `<option value="${element}">${element}</option>`

        document.getElementById("select_react").insertAdjacentHTML("beforeend", html)
    });
    document.getElementById("search_react").addEventListener("click", function (e) {
        searchReaction()
    })
}

/**
 * Recherche d'image correspondante
 */
async function searchReaction() {
    let search_value = document.getElementById("select_react").value
    const response = await fetch('https://api.otakugifs.xyz/gif?reaction=' + search_value);
    const data = await response.json();
    document.getElementById("anime_react").innerHTML = ""
    let html = `<img src="${data.url}" alt="gif_anime"><p><a href="${data.url}" target="_blank">Original</a></p>`
    document.getElementById("anime_react").insertAdjacentHTML("beforeend", html)
}

