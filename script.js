const cont = document.querySelector('#mainCont');

const spinner = document.querySelector('#spinner');
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');

let searchBar = document.querySelector('#searchBtn');

let sortBtn = document.querySelector('#sortBtn');

sortBtn.addEventListener('click', () => {
    doSort()
    console.log('sorted')
})

searchBar.addEventListener('input', pokeFetch(searchBar.value));

const typeColors = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD"
}

let offset = 1;
let limit = 8;

previous.addEventListener('click', () => {
    if (offset != 1) {
        offset -= 9;
        removeChildNodes(cont);
        callPokemon(offset, limit);

        setTimeout(function() {
            doSort();
        }, 3000);
    }
})

next.addEventListener('click', () => {
    if (offset <= 898) {
        offset += 9;
        removeChildNodes(cont);
        callPokemon(offset, limit);

        setTimeout(function() {
            doSort();
        }, 3000);
    }
})

function pokeFetch(id) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
        .then(res => res.json())
        .then(data => {
            pokeProfile(data);
            spinner.style.display = 'none';
        })
}

function callPokemon(offset, limit) {
    spinner.style.display = "block";
    for (let i = offset; i <= offset + limit; i++) {
        pokeFetch(i);
    }
}

function pokeProfile(pokemon) {

    const flipCard = document.createElement('div');
    flipCard.classList.add('flip-card');
    flipCard.id = 'id-' + pokemon.id;

    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');

    flipCard.appendChild(cardContainer);

    const pokeContainer = document.createElement('div');
    pokeContainer.classList.add('pokeContainer');

    const spriteContainer = document.createElement('div');
    spriteContainer.classList.add('imgContainer');
    spriteContainer.style.backgroundImage = `url(blobs/${pokemon.types[0].type.name}/main.svg)`

    const secondSpriteContainer = document.createElement('div');
    secondSpriteContainer.classList.add('imgContainer');

    spriteContainer.appendChild(secondSpriteContainer);


    if (pokemon.types.length > 1) {
        secondSpriteContainer.style.backgroundImage = `url(blobs/${pokemon.types[1].type.name}/secondary.svg)`;
    }

    const sprite = document.createElement('img');
    sprite.classList.add('img')
    sprite.src = pokemon.sprites.front_default;

    secondSpriteContainer.appendChild(sprite);

    const pokeId = document.createElement('p');
    pokeId.classList.add('pokeId')
    pokeId.innerText = `#${ pokemon.id.toString().padStart(3, 0)}`;
    pokeContainer.appendChild(pokeId);

    const pokeName = document.createElement('p');
    pokeName.classList.add('pokeName');
    pokeName.textContent = pokemon.name;

    pokeContainer.appendChild(spriteContainer);
    pokeContainer.appendChild(pokeType(pokemon.types));
    pokeContainer.appendChild(pokeId);
    pokeContainer.appendChild(pokeName);

    const cardBack = document.createElement('div');
    cardBack.classList.add('pokeContainer-back');

    cardBack.appendChild(progressBar(pokemon.stats));

    cardContainer.appendChild(pokeContainer);
    cardContainer.appendChild(cardBack);

    cont.appendChild(flipCard);

}

function progressBar(stats) {
    const statsContainer = document.createElement('div');
    statsContainer.classList.add('statsContainer');

    for (let stat of stats) {

        const statPercent = stat.base_stat * 0.5 + '%';
        const statContainer = document.createElement('div');
        statContainer.classList.add('col');
        statContainer.classList.add('statContainer');
        statContainer.classList.add(`stat-${stat.stat.name}`)

        const statName = document.createElement('p');
        statName.classList.add('text-capitalize');
        statName.classList.add('statName');
        statName.textContent = stat.stat.name;

        const progress = document.createElement('div');
        progress.classList.add('progress');
        progress.style.height = '60px';
        progress.classList.add('statBar');


        const progressBar = document.createElement('div');
        progressBar.classList.add('progress-bar');
        progressBar.classList.add('statBar');
        progressBar.setAttribute('role', 'progressbar');
        progressBar.setAttribute('aria-valuenow', stat.base_stat);
        progressBar.setAttribute('aria-valuemin', 0);
        progressBar.setAttribute('aria-valuemax', 200);
        progressBar.style.height = '60px';
        progressBar.style.width = statPercent;

        progressBar.textContent = stat.base_stat;

        progress.appendChild(progressBar);
        statContainer.appendChild(statName);
        statContainer.appendChild(progress);

        statsContainer.appendChild(statContainer);

    }

    return statsContainer;
}

function pokeType(types) {
    const typesCont = document.createElement('div');
    typesCont.classList.add('pokeTypes');

    for (let type of types) {

        const typeCont = document.createElement('div');
        typeCont.classList.add('pokeType');

        const typeBar = document.createElement('div');
        typeBar.classList.add('typeBar');
        typeBar.classList.add('progress');
        typeBar.style.height = '40px';

        typeBar.style.backgroundColor = typeColors[type.type.name];

        const typeName = document.createElement('p');
        typeName.classList.add('typeName');
        typeName.classList.add('text-capitalize');
        typeName.classList.add('text-light');
        typeName.classList.add('fs-6');
        typeName.classList.add('fw-bold');
        typeName.textContent = type.type.name;

        typeCont.appendChild(typeBar);
        typeBar.appendChild(typeName);

        typesCont.appendChild(typeCont);
    }
    return typesCont;
}


function removeChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

callPokemon(offset, limit);

function doSort() {
    const container = cont;
    const elements = cont.childNodes;
    const sortMe = [];
    for (let i = 0; i < elements.length; i++) {
        if (!elements[i].id) {
            continue;
        }
        let sortPart = elements[i].id.split("-");
        if (sortPart.length > 1) {
            sortMe.push([1 * sortPart[1], elements[i]]);
        }
    }
    sortMe.sort(function(x, y) {
        return x[0] - y[0];
    });
    for (let i = 0; i < sortMe.length; i++) {
        container.appendChild(sortMe[i][1]);
    }
}
setTimeout(function() {
    doSort();
}, 3000);