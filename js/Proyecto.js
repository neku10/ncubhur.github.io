// Modulos necesarios
import * as THREE from "../lib/three.module.js";
import {GLTFLoader} from "../lib/GLTFLoader.module.js";

// Variables de consenso
let renderer, scene, camera;

// Otras globales
let esferaCubo;
let board;
let angulo = 0;

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
    //renderer.setClearColor( new THREE.Color(0x0000AA) ); //a que color pintar el fondo se puede hacer con scene.background
    document.getElementById('container').appendChild( renderer.domElement );

    // Escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5,0.5,0.5);

    // Camara
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1,1000);
    camera.position.set( 0.5, 2, 7 );
    camera.lookAt( new THREE.Vector3(0,1,0) );
}

//! Carga de objetos y construccion del grafo
function loadScene()
{
    const material = new THREE.MeshBasicMaterial( { color: 'yellow', wireframe: true } );

    const geoCubo = new THREE.BoxGeometry( 2,2,2 );
    const geoEsfera = new THREE.SphereGeometry( 1, 20,20 );
    //const geoLineaBoard = new THREE.BoxGeometry(64,4,4);

    // Objetos dibujables
    const cubo = new THREE.Mesh( geoCubo, material );
    const esfera = new THREE.Mesh( geoEsfera, material );
    cubo.position.x = -1;
    esfera.position.x = 1;
    //const lineaBoard = new THREE.Mesh( geoLineaBoard, material );
    //lineaBoard.position.x = 0;

    // Suelo
    const suelo = new THREE.Mesh( new THREE.PlaneGeometry(10,10, 10,10), material );
    suelo.rotation.x = -Math.PI / 2;
    suelo.position.y = -0.1;
    scene.add(suelo);

    // Importar un modelo en json
    /*const loader = new THREE.ObjectLoader();

    loader.load( 'models/soldado/soldado.json', 
        function(objeto){
            cubo.add(objeto);
            objeto.position.y = 1;
        }
    )*/

    // Importar un modelo en gltf
    const glloader = new GLTFLoader();

    glloader.load( 'models/tic_tac_toe/tablero.gltf', function ( gltf ) {
        gltf.scene.position.y = 1;
        //gltf.scene.rotation.y = -Math.PI/2;
        esfera.add( gltf.scene );
    
    }, undefined, function ( error ) {
    
        console.error( error );
    
    } );

    glloader.load( 'models/tic_tac_toe/cruz.gltf', function ( gltf ) {
        gltf.scene.position.y = 1;
        gltf.scene.rotation.y = -Math.PI/2;
        cubo.add( gltf.scene );
    
    }, undefined, function ( error ) {
    
        console.error( error );
    
    } );
    glloader.load( 'models/tic_tac_toe/circulo.gltf', function ( gltf ) {
        gltf.scene.position.y = 2;
        gltf.scene.rotation.y = -Math.PI/2;
        cubo.add( gltf.scene );
    
    }, undefined, function ( error ) {
    
        console.error( error );
    
    } );

    // Objeto contenedor
    board = new THREE.Object3D();
    board.position.y = 1.5;

    // Organizacion del grafo
    scene.add( board);
    board.add( cubo );
    board.add( esfera );
    cubo.add( new THREE.AxesHelper(1) );
    scene.add( new THREE.AxesHelper(3) );

}

//! Etapa de actualizacion para cada frame
function update()
{
    angulo += 0.01;
    board.rotation.y = angulo;
}

//! Callback de refresco (se encola a si misma)
function render()
{
    requestAnimationFrame( render );
    update();
    renderer.render( scene, camera );
}