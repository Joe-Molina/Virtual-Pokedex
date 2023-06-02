const d = document,
    $ = (selector) => d.querySelector(selector),
    $form = $('.buscar-form'),
    $section = $('.pokemons-section'),
    $template = d.getElementById('crud-template').content,
    $fragment = d.createDocumentFragment();
    
    
    const buscarTodos = async () =>{
        let res = await axios.get("https://pokeapi.co/api/v2/pokemon?offset=0&limit=1"),
            json = await res.data.results;
            
            const requests = json.map(el => axios.get(`${el.url}`));
            const responses = await Promise.all(requests);
            const data = responses.map(res2 => res2.data);
            
            console.log(data.length)
        return data;
    };

    const cargarPokemons = async () => {

            if (window.innerWidth < 600){
                $('.buscar-tipo').style.display = 'none';
                $('.buscar-generacion').style.display = 'none';
            }
            const data = await buscarTodos()
        
                data.forEach(pokemon => {
                    const nombrePoke = pokemon.name;
                    const imgPoke = pokemon.sprites.front_default;
                    
                    $template.querySelector('.name').textContent = nombrePoke;
                    $template.querySelector('img').src = imgPoke;
                    $template.querySelector("div").classList.add('pokemon-article');
                    let $clone = d.importNode($template, true);
                    $fragment.appendChild($clone);

                })
                // Añadimos el fragmento a la tabla
                $section.appendChild($fragment);

                d.querySelectorAll('.buscar-tipo button').forEach(el =>{
                    el.disabled = false;
                }) 

                d.querySelectorAll('.buscar-generacion button').forEach(el =>{
                    el.disabled = false;
                }) 
    };

    const burcarPorTipo = async (tipo,tipo2) =>{
        d.querySelectorAll('.buscar-tipo button').forEach(el =>{
            el.disabled = true
        })
        d.querySelectorAll('.buscar-generacion button').forEach(el =>{
            el.disabled = true
        })
        $('.selector-tipo').dataset.tiposelected = tipo;

        if($('.selector-tipo').dataset.tiposelected == 'all'){
            $('.allPokemons-title').textContent = 'all pokemons';

            const data = await buscarTodos()
            
            data.forEach(pokemon => {
                const nombrePoke = pokemon.name;
                const imgPoke = pokemon.sprites.front_default;
                
                $template.querySelector('.name').textContent = nombrePoke;
                $template.querySelector('img').src = imgPoke;
                $template.querySelector("div").classList.add('pokemon-article');
                let $clone = d.importNode($template, true);
                $fragment.appendChild($clone);

            })
            // Añadimos el fragmento a la tabla
            $section.appendChild($fragment);


        }else{ 
            let respuestaTipos = await axios.get(`https://pokeapi.co/api/v2/type/${tipo}`),
            jsonTipos = respuestaTipos.data.pokemon;
            
            const requestTipos = jsonTipos.map(el => axios.get(`${el.pokemon.url}`)),
            responsesTipos = await Promise.all(requestTipos),
            dataTipos = responsesTipos.map(responsesTipos => responsesTipos.data)
            
            dataTipos.forEach(pokemon => {
                const nombrePoke = pokemon.name;
                const imgPoke = pokemon.sprites.front_default || "" ;
                
                
                $template.querySelector('.name').textContent = nombrePoke;
                $template.querySelector('img').src = imgPoke;
                $template.querySelector("div").classList.add('pokemon-article');
                let $clone = d.importNode($template, true);
                $fragment.appendChild($clone);
                
            })
        }
            $section.appendChild($fragment);
            

        d.querySelectorAll('.buscar-tipo button').forEach(el =>{
            el.disabled = false;
        })
        d.querySelectorAll('.buscar-generacion button').forEach(el =>{
            el.disabled = false
        })


    };

    const buscarPorGeneracion = async (generacion) =>{
        d.querySelectorAll('.buscar-generacion button').forEach(el =>{
            el.disabled = true
        })
        d.querySelectorAll('.buscar-tipo button').forEach(el =>{
            el.disabled = true
        })

        if($('.selector-tipo').dataset.tiposelected == 'all'){
  
            const data = await buscarTodos()

            let start = parseInt( $(`.generacion-${generacion}`).dataset.start)
            let end = parseInt($(`.generacion-${generacion}`).dataset.end)

            data.forEach(pokemon => {

                if(pokemon.id > start && pokemon.id < end){

                    const nombrePoke = pokemon.name;
                    const imgPoke = pokemon.sprites.front_default || "" ;
        
                    
                    $template.querySelector('.name').textContent = nombrePoke;
                    $template.querySelector('img').src = imgPoke;
                    $template.querySelector("div").classList.add('pokemon-article');
                    let $clone = d.importNode($template, true);
                    $fragment.appendChild($clone);
                }
                
            })
            $section.appendChild($fragment);
        } else {
            let tipo = $('.selector-tipo').dataset.tiposelected;

            let respuestaTipos = await axios.get(`https://pokeapi.co/api/v2/type/${tipo}`),
                jsonTipos = respuestaTipos.data.pokemon;
            
            const requestTipos = jsonTipos.map(el => axios.get(`${el.pokemon.url}`)),
                responsesTipos = await Promise.all(requestTipos),
                dataTipos = responsesTipos.map(responsesTipos => responsesTipos.data)

            let start = parseInt( $(`.generacion-${generacion}`).dataset.start)
            let end = parseInt($(`.generacion-${generacion}`).dataset.end)


            dataTipos.forEach(pokemon => {


                if(pokemon.id >= start && pokemon.id <= end){

                    const nombrePoke = pokemon.name;
                    const imgPoke = pokemon.sprites.front_default || "" ;
        
                    
                    $template.querySelector('.name').textContent = nombrePoke;
                    $template.querySelector('img').src = imgPoke;
                    $template.querySelector("div").classList.add('pokemon-article');
                    let $clone = d.importNode($template, true);
                    $fragment.appendChild($clone);
                }
                
            })
            $section.appendChild($fragment);
        }

        

        d.querySelectorAll('.buscar-generacion button').forEach(el =>{
            el.disabled = false
         })
         d.querySelectorAll('.buscar-tipo button').forEach(el =>{
            el.disabled = false
        })
    };

    const infoPokemon = async (pokemon) =>{

        let res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`),
            pokemondata = await res.data;
            infopokemon = {
                nombre: pokemondata.name,
                tipo: pokemondata.types[0].type.name,
                id : pokemondata.id,
                peso: `${(pokemondata.weight/10)} Kg`,
                altura: `${pokemondata.height/10} Mts`,
                region: pokemondata.id,
                movimientos: { habilidad1: pokemondata.moves[0].move.name,
                            habilidad2: pokemondata.moves[1].move.name,
                            habilidad3: pokemondata.moves[2].move.name,
                            habilidad4: pokemondata.moves[3].move.name,
                            habilidad5: pokemondata.moves[4].move.name,
                },   
                estadisticas: {
                    hp: pokemondata.stats[0].base_stat,
                    ataque: pokemondata.stats[1].base_stat,
                    defensa: pokemondata.stats[2].base_stat,
                    atqEsp: pokemondata.stats[3].base_stat,
                    defEsp: pokemondata.stats[4].base_stat,
                    velocidad: pokemondata.stats[5].base_stat,
                }            
            }   
                
                if(infopokemon.region < 152){
                    infopokemon.region = "Kanto"
                } else if(id >= 152 && id <= 251){
                    infopokemon.region = "Johto"
                } else if(id >= 252 && id <= 386){
                    infopokemon.region = "Hoenn"
                } else if(id >= 387 && id <= 493){
                    infopokemon.region = "Sinnoh"
                } else if(id >= 494 && id <= 649){
                    infopokemon.region = "Teselia"
                } else if(id >= 650 && id <= 721){
                    infopokemon.region = "Kalos"
                } else if(id >= 722 && id <= 809){
                    infopokemon.region = "Alola"
                } else if(id >= 810 && id <= 905){
                    infopokemon.region = "Galar"
                } else if(id >= 906 && id <= 1010){
                    infopokemon.region = "Paldea"
                } 

            console.log(infopokemon)

            
            
    }
    
    window.addEventListener('click', async e => {
            
        if(e.target.closest('.pokemon-article')){
            e.preventDefault()
            const $pokemon = e.target.closest('.pokemon-article');
            pokemonName = $pokemon.querySelector('p').textContent
            console.log($pokemon.querySelector('p').textContent)
            infoPokemon(pokemonName)
            }   
    
        d.querySelectorAll('.buscar-tipo button').forEach(el =>{
            const type = el.dataset.type;
            const type2 = el.textContent;

            
            if(e.target.closest(`.type-${type}`)){
                d.querySelectorAll('.pokemon-article').forEach( pokemon =>{
                    pokemon.remove()
                })
                burcarPorTipo(type,type2)
            }
        })

        d.querySelectorAll('.buscar-generacion button').forEach(el =>{
            const generacionDataset = el.dataset.type;
            const generacion = el.textContent;

            if(e.target.closest(`.generacion-${generacion}`)){
                d.querySelectorAll('.pokemon-article').forEach( pokemon =>{
                    pokemon.remove()
                })
                console.log(generacion)
                buscarPorGeneracion(generacion)
            }
        })

        if(e.target.closest('.btn-opciones')){

            if($('.buscar-generacion').style.display == 'flex'){
                $('.buscar-generacion').style.display = 'none';
                $('.buscar-tipo').style.display = 'none';
            } else{
                $('.buscar-generacion').style.display = 'flex';
                $('.buscar-tipo').style.display = 'flex';
            }
        }

        if(e.target.closest('.nav-buscar .btn-pokemon')){

            if($('.app .pokemon-info').style.display != 'none'){
                $('.app .pokemon-info').style.display = 'none'
           } else {
            $('.app .pokemon-info').style.display = 'flex'
           }
        }

    });

 d.addEventListener('DOMContentLoaded', cargarPokemons);