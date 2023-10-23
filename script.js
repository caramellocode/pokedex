let typeMapping = {
    'grass': 'bg-green',
    'bug': 'bg-bug',
    'water': 'bg-water',
    'fire': 'bg-fire',
    'electric': 'bg-electro',
    'normal': 'bg-normal',
    'poison': 'bg-poison',
    'ground': 'bg-ground',
    'fighting': 'bg-fighting',
    'psychic': 'bg-psychic',
    'fairy': 'bg-fairy',
    'rock': 'bg-ground',
    'ghost': 'bg-psychic',
    'ice': 'bg-ice',
    'dragon': 'bg-dragon',
    'dark': 'bg-psychic',
    'steel': 'bg-steel',
    'flying': 'bg-flying'
};

let searchResults = [];
let nextCardIndex = 20;
let loadUrl;
let completePokemonData;
let nextPokemonData;
let currentPokemonInfo = [];
let currentPokemonUrl = [];
let newPokemonInfo = [];
let newPokemonUrl = [];
let isExpanded = false;

async function loadPokemonData() {
    let url = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20';
    let response = await fetch(url);
    completePokemonData = await response.json();
    loadPokemonInfo();
}

function loadPokemonInfo() {
    for (let j = 0; j < completePokemonData['results'].length; j++) {
        const data = completePokemonData['results'][j];
        let url = data['url'];
        currentPokemonUrl.push(url);
    }
    loadEachPokemon();
}

async function loadEachPokemon() {
    const allPromises = currentPokemonUrl.map(async (url) => {
        let response = await fetch(url);
        return await response.json();
    });
    currentPokemonInfo = await Promise.all(allPromises);
    renderPokemon();
}

function renderPokemon() {
    const pokedex = document.getElementById('pokedex');
    pokedex.innerHTML = '';
    for (let l = 0; l < currentPokemonInfo.length; l++) {
        const index = currentPokemonInfo[l];
        const cardIndex = nextCardIndex;
        nextCardIndex++;

       

        const cardHTML = renderHTML(index, cardIndex);
        pokedex.innerHTML += cardHTML;

        // Fügt die Typ-Informationen hinzu
        pokemonType(index, cardIndex);
        renderTypeInfos(index, cardIndex);
    }

    document.getElementById('loading').classList.toggle('d-none');
    document.getElementById('nextButton').classList.toggle('d-none');
    document.getElementById('goUp').classList.toggle('d-none');
}

function renderTypeInfos(index, i) {
    const typeContainer = document.getElementById(`type${i}`);
    for (let m = 0; m < index['types'].length; m++) {
        const type = index['types'][m];
        typeContainer.innerHTML += `<span>${type['type']['name']}</span>`;
    }
    document.getElementById('loading').classList.toggle('d-none');
    document.getElementById('nextButton').classList.toggle('d-none');
}
  

function pokemonType(index, l) {
    const typeName = index['types'][0]['type']['name'];
    if (typeMapping[typeName]) {
        document.getElementById(`pokeCard${l}`).classList.add(typeMapping[typeName]);
    }
}

function renderHTML(index, i) {
    const types = index['types'].map(type => type['type']['name']).join(', ');
    const typeClass = typeMapping[types[0]] || 'bg-normal'; // Stellen Sie sicher, dass immer eine Hintergrundklasse vorhanden ist, selbst wenn der Typ nicht in typeMapping ist.

    return `
    <div class="outerCard">
        <div id="pokeCard${i}" class="card ${typeClass}" onclick="expandCard(this)">
            <div class="front" onclick="toggleCard(${i})">
                <h3>${index['name']}</h3>
                <img src="${index['sprites']['other']['official-artwork']['front_default']}" alt="Pokemon Artwork">
                <p>Type: ${types}</p>
            </div>
            <div class="back">
                <h3>${index['name']}</h3>
                <div class="info width-96">
                    <div class="typeInfo width-96 pdl-10" id="type${i}">
                    <span><b>Type</b></span>
                    </div>
                    <div>
                        <span><b>ID:${index['id']}</b></span>
                    </div>
                </div>
                <div class="stats width-96 pdl-10">
                    <span><b>Height:</b>${index['height'] / 10}m</span>
                    <span><b>Weight:</b>${index['weight'] / 10}kg</span>
                </div>
                <div class="stats width-96 pdl-10">
                    <span><b>HP:</b> ${index['stats']['0']['base_stat']}</span>
                    <span><b>Attack:</b> ${index['stats']['1']['base_stat']}</span>
                    <span><b>Defense:</b> ${index['stats']['2']['base_stat']}</span>
                </div>
            </div>
        </div>
    </div>
    `;
}

function searchPokemon() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    for (let i = 0; i < currentPokemonInfo.length; i++) {
        const pokemon = currentPokemonInfo[i];
        if (pokemon.name.toLowerCase() === searchInput) {
            displayPokemon(pokemon);
            return;
        }
    }

    alert(`Das Pokémon "${searchInput}" wurde nicht gefunden.`);
}

// Funktion zum Anzeigen des gefundenen Pokémon
function displayPokemon(pokemon) {
    const popupCard = document.getElementById('popUpCard');
    const innerCard = document.querySelector('.innerCard');

    innerCard.innerHTML = renderHTML(pokemon, 'searchResult');

    const typeName = pokemon.types[0].type.name;
    if (typeMapping[typeName]) {
        document.querySelector('.innerCard .card').classList.add(typeMapping[typeName]);
    }

    popupCard.classList.remove('d-none');
  
    searchResults.push(pokemon.id);

   
    window.scrollTo(0, popupCard.offsetTop);
}


document.getElementById('searchButton').addEventListener('click', searchPokemon);




function expandCard(card) {
    if (!isExpanded) {
        
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');

        const expandedCard = card.cloneNode(true);
        expandedCard.classList.add('expanded-card');

        overlay.appendChild(expandedCard);
        document.body.appendChild(overlay);

        overlay.addEventListener('click', () => {
            overlay.remove();
            isExpanded = false;
        });

        isExpanded = true;
    } else {
     
        const cardIndex = card.id.replace('pokeCard', '');
        toggleCard(cardIndex);
    }
}

function toggleCard(cardIndex) {
    const card = document.getElementById(`pokeCard${cardIndex}`);
    card.classList.toggle('show-back');
}











