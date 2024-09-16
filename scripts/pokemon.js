export async function fetchAllPokemonData(allPokemon) {
    let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0');
    let data = await response.json();
    
    for(let result of data.results){
        let pokemonData = await fetch(result.url);
        let pokemon = await pokemonData.json();
        allPokemon.push({
            id : pokemon.id,
            name : pokemon.name,
            image1 : pokemon.sprites.other.dream_world.front_default,
            image2 : pokemon.sprites.front_default
        });
    }
}



