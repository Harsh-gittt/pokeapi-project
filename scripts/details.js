const url = window.location.href;
const urlParams = new URLSearchParams(window.location.search);
const urlId = urlParams.get('id');
const card = document.querySelector('.card');

const typeColors = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    dark: "#EE99AC",
    default: "#ED1C24"
  };

async function fetchPokemonById(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
       
    const data = await response.json();


    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
        const speciesData = await speciesResponse.json();
        let description = speciesData.flavor_text_entries.find(entry => entry.language.name === "en").flavor_text;
    

    let pokemon = {
        pokemonId : data.id,
        pokemonName : data.name,
        pokemonImage : data.sprites.other.dream_world.front_default,
        pokemonWeight : data.weight,
        pokemonHeight : data.height,
        pokemonMove : data.moves[0].move.name,
        pokemonStats : data.stats.map(stat => ({
            name: stat.stat.name,
            base_stat: stat.base_stat
        })),
        pokemonTypes : data.types.map(type => type.type.name),
        aboutPokemon : description
    }

    console.log(pokemon)

    return pokemon;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function statShortner (stat){
    if(stat == 'hp'){
        return 'HP';
    }
    else if(stat == 'attack'){
        return 'ATK'
    }
    else if(stat == 'defense'){
        return 'DEF'
    }
    else if(stat == 'special-attack'){
        return 'SATK'
    }
    else if(stat == 'special-defense'){
        return 'SDEF'
    }
    else if(stat == 'speed'){
        return 'SPD'
    }
}

function generateStyles (type) {
    const bgColorElements = document.querySelectorAll('.pokemon-color-bg');
    const fontColorElements = document.querySelectorAll('.pokemon-color-font');
    
    const bgColor = typeColors[type] || typeColors.default;
    
    bgColorElements.forEach(element => {
        element.style.backgroundColor = bgColor;
    });

    fontColorElements.forEach(element => {
        element.style.color = bgColor;
    });
}

function attachEventListeners() {
    const nextId = Number(urlId) + 1;
    const prevId = Number(urlId) - 1;

    document.querySelector('.left-arrow').addEventListener('click' , () => {
        if(Number(urlId) > 1 && Number(urlId) <= 151){
            window.location.href = `details.html?id=${prevId}`;
        }
    });

    document.querySelector('.right-arrow').addEventListener('click' , () => {
        if(Number(urlId) < 151){
            window.location.href = `details.html?id=${nextId}`;
        }
    });
}

async function generateHtml() {
    const pokemon = await fetchPokemonById(urlId);
    
    let html = `
        <div class="header">
            <div class="back-button">
                <a href="index.html">
                    <i class="ri-arrow-left-line"></i>
                </a>
            </div>

            <div class="pokemon-name">${capitalizeFirstLetter(pokemon.pokemonName)}</div>
            <div class="pokemon-id">#${pokemon.pokemonId}</div>
        </div>

        <div class="pokemon-details">
            <div class="left-arrow arrow">
                <i class="ri-arrow-left-s-line"></i>
            </div>

            <div class="pokemon-image">
                <img src="${pokemon.pokemonImage}" alt="">
            </div>

            <div class="right-arrow arrow">
                <i class="ri-arrow-right-s-line"></i>
            </div>
        </div>

        <div class="other-details">
            <div class="pokemon-typing-container">
                ${pokemonTypeGenerator()}
            </div>

            <div class="about-container">
                <div class="about">About</div>
                <div class="stats-container">
                    <div class="stats weight">
                        <div class="data">
                            <i class="ri-weight-line"></i>
                            ${pokemon.pokemonWeight/10} kg
                        </div>
                        <div class="text">weight</div>
                    </div>
                    <div class="stats height">
                        <div class="data">
                            <i class="ri-ruler-line"></i>
                            ${pokemon.pokemonHeight/10} m
                        </div>
                        <div class="text">height</div>
                    </div>
                    <div class="stats moves">
                        <div class="data">${pokemon.pokemonMove}</div>
                        <div class="text">move</div>
                    </div>
                </div>
                <div class="about-para">${pokemon.aboutPokemon}</div>
            </div>

            <div class="base-stats-container">
                <p>Base Stats</p>

                ${generateStats()}
            </div>

            
        </div>
    `

    card.innerHTML = html;

    attachEventListeners()

    generateStyles(pokemon.pokemonTypes[0]);


    function pokemonTypeGenerator() {
        let html = '';
        pokemon.pokemonTypes.forEach((type) => {
            html += `
                <div class="pokemon-typing pokemon-color-bg">${type}</div>
            `
        });
        return html;
    }

    function generateStats () {
        let html = '';
        pokemon.pokemonStats.forEach((stat) => {
            html += `
                <div class="base-stat">
                <div class="stat-type pokemon-color-font">${statShortner(stat.name)}</div>
                <div class="stat-value">${stat.base_stat}</div>
                <div class="stat-progress-bar">
                    <div class="stat-progress pokemon-color-bg" style="width: ${stat.base_stat}%"></div>
                </div>
            </div>
            `
        });

        return html;
    }
}

generateHtml();

