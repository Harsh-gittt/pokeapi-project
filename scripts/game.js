const maxPokemon = 1000;
let highscore = JSON.parse(localStorage.getItem('savedHighScore')) || 0;
const pokemonImage = document.querySelector('.pokemon-image');
const gameContent = document.querySelector('.game-content');

async function fetchPokemonById(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    return data;
}

function getRandomId () {
    return Math.floor(Math.random() * maxPokemon) + 1;
}

function shuffleArray (options){
    return options.sort(() => Math.random() - 0.5);
}

function updateHighScore () {
    document.querySelector('.high-score').innerHTML = `Highest Score: ${highscore}`;
}

function playGame () {
    let score = 0;
    const alreadyGeneratedIds = [];

    gameContent.innerHTML = `<h1>Who's That Pokemon ?</h1><div class="loading">Loading...</div>`

    async function generateQuesAndOptions() {
        let pokemonId = getRandomId();
        while(alreadyGeneratedIds.includes(pokemonId)){
            pokemonId = getRandomId();
        }
    
        let pokemon = await fetchPokemonById(pokemonId);
    
        const options = [
            {
                optionId : pokemon.id,
                optionName : pokemon.name
            }
        ];
    
        while(options.length < 4){
            let randomPokemonId = getRandomId();
            while(options.includes(randomPokemonId)){
                randomPokemonId = getRandomId();
            }
    
            let pokemonForOptions = await fetchPokemonById(randomPokemonId);
            options.push({
                optionId : pokemonForOptions.id,
                optionName : pokemonForOptions.name
            });
        }
    
        shuffleArray(options);
    
        generateHtml(pokemon , options);  
    }
    
    async function generateHtml (pokemon , options) {
        const getPokemonImage = await pokemon.sprites.other.dream_world.front_default;
        if(getPokemonImage){
            let html = `
                <h1>Who's That Pokemon ?</h1>
                        <div class="pokemon-image">
                            <img src="${getPokemonImage}" />
                        </div>
                        <div class="options-container">
                            ${generateOptions()}
                        </div>
    
                        <div class="score">Score: ${score}</div>
    
                        <div class="game-over-container">
                            <button class="game-over-options play-again">Play again</button>
                            <button class="game-over-options get-info">Get info</button>
                        </div>
            `
    
            gameContent.innerHTML = html;
    
            function generateOptions () {
                let optionsHtml = '';
                options.forEach((option) => {
                    optionsHtml += `
                        <button class="options">${option.optionName}</button>
                    `
                });
                return optionsHtml;
            }
        }
        else{
            generateQuesAndOptions();
        }
    
        document.querySelectorAll('.options').forEach((option) => {
            option.addEventListener('click' , () => {
                checkForAnswer(option , pokemon);
            });
        });

        document.querySelector('.play-again').addEventListener('click', () => {
            playGame();
        });

        document.querySelector('.get-info').addEventListener('click', () => {
            window.location.href = `details.html?id=${pokemon.id}`;
        })
    }
    
    function checkForAnswer (option , pokemon) {
        document.querySelectorAll('.options').forEach(button => {
            button.disabled = true; 
        });

        if(option.innerHTML === pokemon.name){
            option.classList.add('correct-answer');
            score++;
    
            if(score > highscore){
                highscore = score;
                localStorage.setItem('savedHighScore' , JSON.stringify(highscore));
            }
           
            setTimeout(() => {
                gameContent.innerHTML = `
                    <h1>Who's That Pokemon ?</h1>
                    <div class="loading">
                        Loading...
                    </div>
                `
                generateQuesAndOptions();
            }, 500);
        }
        else{
            option.classList.add('wrong-answer');
            let gameOverContainer = document.querySelector('.game-over-container');
            gameOverContainer.style.opacity = 1;
        }
    }

    updateHighScore();
    generateQuesAndOptions();

}

playGame();
