const d = document,
    $ = (selector) => d.querySelector(selector),
    $form = $('.buscar-form'),
    $section = $('.pokemons-section'),
    $template = d.getElementById('crud-template').content,
    $fragment = d.createDocumentFragment();
    
    
    const buscarTodos = async () =>{
        let res = await axios.get("https://pokeapi.co/api/v2/pokemon?offset=0&limit=10"),
            json = await res.data.results;
            
            const requests = json.map(el => axios.get(`${el.url}`));
            const responses = await Promise.all(requests);
            const data = responses.map(res2 => res2.data);
            
            console.log(data.length)
        return data;
    };

    const cargarPokemons = async () => {

        $('.pokemon-info').style.display = 'none';  

        if($('.pokemon-info').style.display == 'none') {
            $('.buscar-pokemon-article').style.height = '100%';
            $('.buscar-tipo').style.height = '18%';
            $('.buscar-generacion').style.height = '9%'
            $('.pokemons-section').style.height = '73%'
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
        console.log(pokemondata.id)
           let infopokemons = {
                img: pokemondata.sprites.other.home.front_default,
                nombre: pokemondata.name,
                tipo: pokemondata.types[0].type.name,
                id : pokemondata.id,
                peso: `${(pokemondata.weight/10)} Kg`,
                altura: `${pokemondata.height/10} Mts`,
                region: pokemondata.id,
                movimientos: { habilidad1: pokemondata.moves[0].move.name ,
                            habilidad2: pokemondata.moves[1].move.name ,
                            habilidad3: pokemondata.moves[2].move.name ,
                            habilidad4: pokemondata.moves[3].move.name ,
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
                
                if(infopokemons.region < 152){
                    infopokemons.region = "Kanto"
                } else if(infopokemons.id >= 152 && infopokemons.id <= 251){
                    infopokemons.region = "Johto"
                } else if(infopokemons.id >= 252 && infopokemons.id <= 386){
                    infopokemons.region = "Hoenn"
                } else if(infopokemons.id >= 387 && infopokemons.id <= 493){
                    infopokemons.region = "Sinnoh"
                } else if(infopokemons.id >= 494 && infopokemons.id <= 649){
                    infopokemons.region = "Teselia"
                } else if(infopokemons.id >= 650 && infopokemons.id <= 721){
                    infopokemons.region = "Kalos"
                } else if(infopokemons.id >= 722 && infopokemons.id <= 809){
                    infopokemons.region = "Alola"
                } else if(infopokemons.id >= 810 && infopokemons.id <= 905){
                    infopokemons.region = "Galar"
                } else if(infopokemons.id >= 906 && infopokemons.id <= 1010){
                    infopokemons.region = "Paldea"
                } 
            
            $('.pokemon-info .pokemon-info-img img').src = infopokemons.img;
            $('.pokemon-info .pokemon-info-nombre').textContent = `Nombre: ${infopokemons.nombre}`;
            $('.pokemon-info .pokemon-info-tipo').textContent = `Tipo: ${infopokemons.tipo}`;
            $('.pokemon-info .pokemon-info-id').textContent = `Id: ${infopokemons.id}`;
            $('.pokemon-info .pokemon-info-peso').textContent = `Peso: ${infopokemons.peso}`;
            $('.pokemon-info .pokemon-info-altura').textContent = `Altura: ${infopokemons.altura}`;
            $('.pokemon-info .pokemon-info-region').textContent = `Region: ${infopokemons.region}`;
            
            $('.pokemon-info-estadisticas .pokemon-info-hp p').textContent =  `Vida: ${infopokemons.estadisticas.hp}`;
            $('.pokemon-info-estadisticas .pokemon-info-ataque p').textContent =  `Ataque: ${infopokemons.estadisticas.ataque}`;
            $('.pokemon-info-estadisticas .pokemon-info-defensa p').textContent =  `Defensa: ${infopokemons.estadisticas.defensa}`;
            $('.pokemon-info-estadisticas .pokemon-info-atqEsp p').textContent =  `Ataque especial: ${infopokemons.estadisticas.atqEsp}`;
            $('.pokemon-info-estadisticas .pokemon-info-defEsp p').textContent =  `Defensa especial: ${infopokemons.estadisticas.defEsp}`;
            $('.pokemon-info-estadisticas .pokemon-info-speed p').textContent =  `Velocidad: ${infopokemons.estadisticas.velocidad}`;
            $('.pokemon-seleccionado').dataset.select =  `${infopokemons.nombre}`;
            
            while ($('.pokemon-info-habilidades').firstChild) {
                $('.pokemon-info-habilidades').removeChild($('.pokemon-info-habilidades').firstChild);
            }        
            for (let movimiento in infopokemons.movimientos) {
                $pMovimiento = d.createElement('p')               
                $pMovimiento.textContent = infopokemons.movimientos[movimiento];               
                $fragment.appendChild($pMovimiento)
            }
            
            $movimientoTitle = d.createElement('div')
            $movimientoTitle.textContent = 'movimientos'
            $movimientoTitle.classList.add('pokemon-info-habilidades-title')

            $('.pokemon-info-habilidades').appendChild($movimientoTitle)
            $('.pokemon-info-habilidades').appendChild($fragment)

            
            if($('.pokemon-seleccionado').dataset.select != "ninguno"){
                $('.pokemon-info').style.display = 'flex';
            } else {
                $('.pokemon-info').style.display = 'none';  
            }

            if($('.pokemon-info').style.display != 'none') {
                $('.buscar-pokemon-article').style.height = '60%';
                $('.buscar-tipo').style.height = '30%';
                $('.buscar-generacion').style.height = '15%'
                $('.pokemons-section').style.height = '55%'
            }
        
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

    });

 d.addEventListener('DOMContentLoaded', cargarPokemons);