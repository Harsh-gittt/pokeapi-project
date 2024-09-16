import { fetchAllPokemonData } from "./pokemon.js";
const allPokemon = [];
const cardGrid = document.querySelector('.card-grid');
const searchInput = document.querySelector('.search-wrapper>input');
const searchIcon = document.querySelector('.search-icon');
const closeSearchIcon = document.querySelector('.close-search-icon');


function generateHtml(allPokemon) {

    let html = '';

    allPokemon.forEach((pokemon) => {
        html += `
            <div class="card" data-pokemon-Id="${pokemon.id}">
                <div class="id-section">#${pokemon.id}</div>
                <div class="image-section">
                    <img src="${pokemon.image1}" alt="">
                </div>
                <div class="name-section">${pokemon.name}</div>
            </div>
        `
    });
    cardGrid.innerHTML = html;

    document.querySelectorAll('.card').forEach((card) => {
        card.addEventListener('click', () => {
            let pokemonId = card.dataset.pokemonId;
            console.log(pokemonId);
            window.location.href = `details.html?id=${pokemonId}`;
        })
    })
}

async function loadPokemon () {
    await fetchAllPokemonData(allPokemon);
    generateHtml(allPokemon);
}

function filterPokemon (query) {
    if(query === ''){
        generateHtml(allPokemon);
        return;
    }

    else{
        const filtered = allPokemon.filter(pokemon => 
            pokemon.name.toLowerCase().includes(query.toLowerCase()) ||
            pokemon.id.toString().includes(query)
        );

        generateHtml(filtered);
    }
}

searchIcon.addEventListener('click', () => {
    filterPokemon(searchInput.value);
});

searchInput.addEventListener('input', () => {
    filterPokemon(searchInput.value);
});

closeSearchIcon.addEventListener('click', () => {
    searchInput.value = '';
    filterPokemon('');
})

loadPokemon();