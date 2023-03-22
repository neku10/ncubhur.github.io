// Modulos necesarios
import * as THREE from "../lib/three.module.js";
import {GLTFLoader} from "../lib/GLTFLoader.module.js";
import {OrbitControls} from "../lib/OrbitControls.module.js";
import {TWEEN} from "../lib/tween.module.min.js";


// Variables de consenso
let renderer, scene, camera;

// Otras globales
let cameraControls, effectController;
let board;
let piezas;
let piezasTablero;
let areasClicables;
let estadoTablero;
let jugador;
let contador;
let divResultado = document.getElementById("reinicio");

// Acciones
init();
loadScene();
render();
//! Inicializacion del entorno: motor, camara y escena
function init()
{
    // Motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById('container').appendChild( renderer.domElement );

    // Escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5,0.5,0.5);

    // Instanciar la camara
    camera= new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.5,100);
    camera.position.set(-2.133,2.0422,0.114);
    cameraControls = new OrbitControls( camera, renderer.domElement );
    cameraControls.target.set(0,1,0);
    camera.lookAt(0,1,0);

    // Luces
    const ambiental = new THREE.AmbientLight(0x222222, 7);
    scene.add(ambiental);
    const direccional = new THREE.DirectionalLight(0xFFFFFF,0.3);
    direccional.position.set(-2,2,0);
    direccional.castShadow = true;
    scene.add(direccional);
    const puntual = new THREE.PointLight(0xFFFFFF,0.7);
    puntual.position.set(2,6,1);
    scene.add(puntual);
    const focal = new THREE.SpotLight(0xFFFFFF,0.7);
    focal.position.set(-1.5,2,0.5);
    focal.target.position.set(0,2,0);
    focal.angle= Math.PI/7;
    focal.penumbra = 0.3;
    focal.castShadow= true;
    focal.shadow.camera.far = 20;
    focal.shadow.camera.fov = 80;
    scene.add(focal);

    
    //renderer.domElement.addEventListener('dblclick', animate );
    renderer.domElement.addEventListener('dblclick', onClick, false);
    divResultado.addEventListener('click',reiniciarJuego,false);

}


//! Carga de objetos y construccion del grafo
function loadScene()
{
    
    const path ="./images/";
    board = new THREE.Object3D();
    piezasTablero = new THREE.Object3D();
    let cruz1 = new THREE.Object3D();
    let cruz2 = new THREE.Object3D();
    let cruz3= new THREE.Object3D();
    let cruz4= new THREE.Object3D();
    let cruz5= new THREE.Object3D();
    let circulo1= new THREE.Object3D();
    let circulo2= new THREE.Object3D();
    let circulo3= new THREE.Object3D();
    let circulo4= new THREE.Object3D();
    board.position.y = 0.93;
    board.position.x = -1;

    //estado inicial
    estadoTablero = [[1,1,1],[1,1,1],[1,1,1]];
    jugador = 'x';
    contador = 0;

    cargarAreasClicables();

    // Importar un modelo en gltf
    const glloader = new GLTFLoader();

    glloader.load( 'models/tic_tac_toe/tablero.gltf', function ( gltf ) {
        //gltf.scene.position.y = 1;
        //gltf.scene.position.x = -1;
        gltf.scene.rotation.y = Math.PI/2;
        gltf.scene.name = 'tablero';
        board.add(gltf.scene);
    
    }, undefined, function ( error ) {
    
        console.error( error );
    
    } );
    glloader.load( 'models/tic_tac_toe/cruz.gltf', function ( gltf ) {
        //gltf.scene.position.y = 1;
        gltf.scene.rotation.y = -Math.PI/2;
        //gltf.scene.position.x = 1;
        gltf.scene.name = 'cruz';
        cruz1.add(gltf.scene);
        cruz2.add(gltf.scene.clone());
        cruz3.add(gltf.scene.clone());
        cruz4.add(gltf.scene.clone());
        cruz5.add(gltf.scene.clone());
        
    }, undefined, function ( error ) {
    
        console.error( error );
    
    } );

    
    glloader.load( 'models/tic_tac_toe/circulo.gltf', function ( gltf ) {
        //gltf.scene.position.y = 2;
        gltf.scene.rotation.y = -Math.PI/2;
        //gltf.scene.position.x = 1;
        circulo1.add(gltf.scene);
        circulo2.add(gltf.scene.clone());
        circulo3.add(gltf.scene.clone());
        circulo4.add(gltf.scene.clone());
    
    }, undefined, function ( error ) {
    
        console.error( error );
    
    } );
    glloader.load( 'models/wooden_bench_remastered/scene.gltf', function ( gltf ) {
        gltf.scene.position.y = -0.5;
        gltf.scene.position.x = -1;
        gltf.scene.rotation.y = -Math.PI/2;
        gltf.scene.scale.set(1.5*gltf.scene.scale.x,1.5*gltf.scene.scale.y,1.5*gltf.scene.scale.z);
        scene.add(gltf.scene);
    
    }, undefined, function ( error ) {
    
        console.error( error );
    
    } );

    // Organizacion del grafo
    piezas = [cruz1, circulo1, cruz2, circulo2, cruz3, circulo3, cruz4, circulo4, cruz5];
    board.add(piezasTablero);
    scene.add( board);

    // Habitacion
    const paredes = [];
    paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
                    map: new THREE.TextureLoader().load(path+"Skansen3/posx.jpg")}) );
    paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
                    map: new THREE.TextureLoader().load(path+"Skansen3/negx.jpg")}) );
    paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
                    map: new THREE.TextureLoader().load(path+"Skansen3/posy.jpg")}) );
    paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
                    map: new THREE.TextureLoader().load(path+"Skansen3/negy.jpg")}) );
    paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
                    map: new THREE.TextureLoader().load(path+"Skansen3/posz.jpg")}) );
    paredes.push( new THREE.MeshBasicMaterial({side:THREE.BackSide,
                    map: new THREE.TextureLoader().load(path+"Skansen3/negz.jpg")}) );
    const habitacion = new THREE.Mesh( new THREE.BoxGeometry(40,40,40),paredes);
    scene.add(habitacion);

}

function cargarAreasClicables(){
        //Area clicable
        const geoCubo = new THREE.BoxGeometry( 0.15,0.03,0.15 );
        const material = new THREE.MeshBasicMaterial({ transparent: true, wireframe: true, opacity: 0});
        areasClicables = new THREE.Group();
        areasClicables.name = "piezas";
    
            //PRIMERA COLUMNA
        const cuboNO = new THREE.Mesh( geoCubo, material );
        cuboNO.position.x = 0.175;
        cuboNO.position.y = 0.05;
        cuboNO.position.z = -0.175;
        areasClicables.add(cuboNO);
    
        const cuboO = new THREE.Mesh( geoCubo, material );
        cuboO.position.y = 0.05;
        cuboO.position.z = -0.175;
        areasClicables.add(cuboO);
    
        const cuboSO = new THREE.Mesh( geoCubo, material );
        cuboSO.position.x = -0.175;
        cuboSO.position.y = 0.05;
        cuboSO.position.z = -0.175;
        areasClicables.add(cuboSO);
    
            //COLUMNA CENTRAL
        const cuboN = new THREE.Mesh( geoCubo, material );
        cuboN.position.x = 0.175;
        cuboN.position.y = 0.05;
        areasClicables.add(cuboN);
    
        const cuboC = new THREE.Mesh( geoCubo, material );
        cuboC.position.y = 0.05;
        areasClicables.add(cuboC);
    
        const cuboS = new THREE.Mesh( geoCubo, material );
        cuboS.position.x = -0.175;
        cuboS.position.y = 0.05;
        areasClicables.add(cuboS);
    
            //TERCERA COLUMNA
        const cuboNE = new THREE.Mesh( geoCubo, material );
        cuboNE.position.x = 0.175;
        cuboNE.position.y = 0.05;
        cuboNE.position.z = 0.175;
        areasClicables.add(cuboNE);
    
        const cuboE = new THREE.Mesh( geoCubo, material );
        cuboE.position.y = 0.05;
        cuboE.position.z = 0.175;
        areasClicables.add(cuboE);
    
        const cuboSE = new THREE.Mesh( geoCubo, material );
        cuboSE.position.x = -0.175;
        cuboSE.position.y = 0.05;
        cuboSE.position.z = 0.175;
        areasClicables.add(cuboSE);
    
        board.add(areasClicables);
}
function onClick(event){
    let x= event.clientX;
    let y = event.clientY;
    x = ( x / window.innerWidth ) * 2 - 1;
    y = -( y / window.innerHeight ) * 2 + 1;
    const rayo = new THREE.Raycaster();
    rayo.setFromCamera(new THREE.Vector2(x,y), camera);
    let intersecciones = rayo.intersectObjects(areasClicables.children,true);

    if( intersecciones.length > 0 ){

        let index = areasClicables.children.findIndex((c) => c.uuid === intersecciones[0].object.uuid);
        addPiece(intersecciones[0]);
        let resultado = comprobarGanador();
        if(resultado!=null){
            divResultado.innerHTML = "EL GANADOR ES "+ jugador.toUpperCase() + " <br> " + "REINICIAR";
            divResultado.style.display = "inline";
            return;
        }else if(contador==8){
            divResultado.innerHTML = "EMPATE" + " <br> " + "REINICIAR";
            divResultado.style.display = "inline";
            return;
        }
        cambiarJugador();
        areasClicables.children.splice(index,1);
        contador++;
    }
}
function actualizarEstadoTablero(casilla){
    let index;
    if(casilla.object.position.z==-0.175){   //primera columna
        index = 0;
    }else if(casilla.object.position.z==0){  //segunda columna
        index = 1;
    }else{                                   //tercera columna
        index = 2;
    }
    if(casilla.object.position.x==0.175){    //fila arriba
        estadoTablero[0][index]=jugador;

    }else if (casilla.object.position.x==0){ //medio
        estadoTablero[1][index]=jugador;

    }else{                                   //abajo
        estadoTablero[2][index]=jugador;

    }
}

function cambiarJugador(){
    //cambiar el jugador actual
    if (jugador == 'x'){
        jugador = 'o';
    }else{
        jugador = 'x';
    }
}
//Se comprueban las casillas del tablero para ver si el ultimo movimiento ha llevado al jugador a ganar la partida
// si  el jugador ha ganado la partida, no puede continuar jugando por lo que se bloquean las casillas restantes
function comprobarGanador(){ 
    //comprobar filas 
    if((estadoTablero[0][0]==estadoTablero[0][1] && estadoTablero[0][1]==estadoTablero[0][2] && estadoTablero[0][2]==jugador) ||
        (estadoTablero[1][0]==estadoTablero[1][1] && estadoTablero[1][1]==estadoTablero[1][2] && estadoTablero[1][2]==jugador)||
        (estadoTablero[2][0]==estadoTablero[2][1] && estadoTablero[2][1]==estadoTablero[2][2] && estadoTablero[2][2]==jugador)){
        areasClicables = new THREE.Group();
        areasClicables.name = "piezas";
        return jugador;
    }
    //comprobar columnas
    if((estadoTablero[0][0]==estadoTablero[1][0] && estadoTablero[1][0]==estadoTablero[2][0] && estadoTablero[2][0]==jugador) ||
        (estadoTablero[0][1]==estadoTablero[1][1] && estadoTablero[1][1]==estadoTablero[2][1] && estadoTablero[2][1]==jugador)  ||
        (estadoTablero[0][2]==estadoTablero[1][2] && estadoTablero[1][2]==estadoTablero[2][2] && estadoTablero[2][2]==jugador)){
        areasClicables = new THREE.Group();
        areasClicables.name = "piezas";
        return jugador;
    }
    //comprobar diagonales
    if((estadoTablero[0][0]==estadoTablero[1][1] && estadoTablero[1][1]==estadoTablero[2][2] && estadoTablero[2][2]==jugador) ||
        (estadoTablero[0][2]==estadoTablero[1][1] && estadoTablero[1][1]==estadoTablero[2][0] && estadoTablero[2][0]==jugador)){
        areasClicables = new THREE.Group();
        areasClicables.name = "piezas";
        return jugador;
    }
    return null;
}

//añade una pieza al tablero en el area clicada con doble click
function addPiece(casilla){
    actualizarEstadoTablero(casilla);
    //movemos la pieza y la añadimos al tablero
    piezas[contador].position.copy(casilla.object.position);
    piezas[contador].position.y = 0.25;
    piezasTablero.add(piezas[contador]);
    const x = piezas[contador].position.x;
    const z = piezas[contador].position.z;
    //animamos la entrada de la pieza
    new TWEEN.Tween( piezas[contador].position ).
        to( {x:[x,x],y:[0.25,0.05],z:[z,z]}, 2000 ).
        interpolation( TWEEN.Interpolation.Bezier ).
        easing( TWEEN.Easing.Bounce.Out ).
        start();
    
}
function reiniciarJuego(){
    //eliminamos las piezas del tablero
    while (piezasTablero.children.length)
    {
        piezasTablero.remove(piezasTablero.children[0]);
    }
    while(areasClicables.children.length){
        areasClicables.remove(areasClicables.children[0]);
    }
    //devolvemos al estado inicial
    estadoTablero = [[1,1,1],[1,1,1],[1,1,1]];
    jugador = 'x';
    contador = 0;
    divResultado.style.display = "none";
    cargarAreasClicables();
}

//! Etapa de actualizacion para cada frame
function update()
{
    TWEEN.update();
}

//! Callback de refresco (se encola a si misma)
function render()
{
    requestAnimationFrame( render );
    update();
    renderer.render( scene, camera );
}