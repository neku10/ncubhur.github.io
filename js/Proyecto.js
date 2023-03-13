// Modulos necesarios
import * as THREE from "../lib/three.module.js";
import {GLTFLoader} from "../lib/GLTFLoader.module.js";
import {OrbitControls} from "../lib/OrbitControls.module.js";

// Variables de consenso
let renderer, scene, camera;

// Otras globales
let cameraControls, effectController;
let mesa;
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

    // Instanciar la camara
    camera= new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.5,100);
    camera.position.set(-2.133,2.0422,0.114);
    cameraControls = new OrbitControls( camera, renderer.domElement );
    cameraControls.target.set(0,1,0);
    camera.lookAt(0,1,0);

    // Luces
    const ambiental = new THREE.AmbientLight(0x222222);
    scene.add(ambiental);
    const direccional = new THREE.DirectionalLight(0xFFFFFF,0.3);
    direccional.position.set(-1,1,-1);
    direccional.castShadow = true;
    scene.add(direccional);
    const puntual = new THREE.PointLight(0xFFFFFF,0.5);
    puntual.position.set(2,7,-4);
    scene.add(puntual);
    const focal = new THREE.SpotLight(0xFFFFFF,0.3);
    focal.position.set(-2,7,4);
    focal.target.position.set(0,0,0);
    focal.angle= Math.PI/7;
    focal.penumbra = 0.3;
    focal.castShadow= true;
    focal.shadow.camera.far = 20;
    focal.shadow.camera.fov = 80;
    scene.add(focal);
    scene.add(new THREE.CameraHelper(focal.shadow.camera));

}

//! Carga de objetos y construccion del grafo
function loadScene()
{
    
    const path ="./images/";
    const material = new THREE.MeshBasicMaterial( { color: 'yellow', wireframe: true } );
    board = new THREE.Object3D();
    board.position.y = 0.93;
    board.position.x = -1;
    //mesa = new THREE.Object3D();
    //const geoCubo = new THREE.BoxGeometry( 2,2,2 );
    //const geoEsfera = new THREE.SphereGeometry( 1, 20,20 );
    //const geoLineaBoard = new THREE.BoxGeometry(64,4,4);

    // Objetos dibujables
    /*const cubo = new THREE.Mesh( geoCubo, material );
    const esfera = new THREE.Mesh( geoEsfera, material );
    cubo.position.x = -1;
    esfera.position.x = 1;*/
    //const lineaBoard = new THREE.Mesh( geoLineaBoard, material );
    //lineaBoard.position.x = 0;

    // Suelo
    /*const suelo = new THREE.Mesh( new THREE.PlaneGeometry(10,10, 10,10), material );
    suelo.rotation.x = -Math.PI / 2;
    suelo.position.y = -0.1;
    scene.add(suelo);
*/
    // Importar un modelo en json
    /*const loader = new THREE.ObjectLoader();

    loader.load( 'models/soldado/soldado.json', 
        function(objeto){
            cubo.add(objeto);
            objeto.position.y = 1;
        }
    )*/


    //Area clicable
    const geoCubo = new THREE.BoxGeometry( 0.15,0.03,0.15 );

        //PRIMERA COLUMNA
    const cuboNE = new THREE.Mesh( geoCubo, material );
    cuboNE.position.y = 0.05;
    cuboNE.position.x = 0.175;
    cuboNE.position.z = -0.175;
    board.add(cuboNE);

    const cuboE = new THREE.Mesh( geoCubo, material );
    cuboE.position.y = 0.05;
    cuboE.position.z = -0.175;
    board.add(cuboE);

    const cuboSE = new THREE.Mesh( geoCubo, material );
    cuboSE.position.y = 0.05;
    cuboSE.position.x = -0.175;
    cuboSE.position.z = -0.175;
    board.add(cuboSE);

        //COLUMNA CENTRAL
    const cuboN = new THREE.Mesh( geoCubo, material );
    cuboN.position.y = 0.05;
    cuboN.position.x = 0.175;
    board.add(cuboN);

    const cuboC = new THREE.Mesh( geoCubo, material );
    cuboC.position.y = 0.05;
    board.add(cuboC);

    const cuboS = new THREE.Mesh( geoCubo, material );
    cuboS.position.y = 0.05;
    cuboS.position.x = -0.175;
    board.add(cuboS);

        //PRIMERA COLUMNA
    const cuboNO = new THREE.Mesh( geoCubo, material );
    cuboNO.position.y = 0.05;
    cuboNO.position.x = 0.175;
    cuboNO.position.z = 0.175;
    board.add(cuboNO);

    const cuboO = new THREE.Mesh( geoCubo, material );
    cuboO.position.y = 0.05;
    cuboO.position.z = 0.175;
    board.add(cuboO);

    const cuboSO = new THREE.Mesh( geoCubo, material );
    cuboSO.position.y = 0.05;
    cuboSO.position.x = -0.175;
    cuboSO.position.z = 0.175;
    board.add(cuboSO);


    // Importar un modelo en gltf
    const glloader = new GLTFLoader();

    glloader.load( 'models/tic_tac_toe/tablero.gltf', function ( gltf ) {
        //gltf.scene.position.y = 1;
        //gltf.scene.position.x = -1;
        gltf.scene.rotation.y = Math.PI/2;
        board.add(gltf.scene)
        //esfera.add( gltf.scene );
        //scene.add(gltf.scene);
    
    }, undefined, function ( error ) {
    
        console.error( error );
    
    } );

    glloader.load( 'models/tic_tac_toe/cruz.gltf', function ( gltf ) {
        gltf.scene.position.y = 1;
        gltf.scene.rotation.y = -Math.PI/2;
        gltf.scene.position.x = 1;
        //cubo.add( gltf.scene );
        scene.add(gltf.scene);
    
    }, undefined, function ( error ) {
    
        console.error( error );
    
    } );
    glloader.load( 'models/tic_tac_toe/circulo.gltf', function ( gltf ) {
        gltf.scene.position.y = 2;
        gltf.scene.rotation.y = -Math.PI/2;
        gltf.scene.position.x = 1;
        //cubo.add( gltf.scene );
        scene.add(gltf.scene);
    
    }, undefined, function ( error ) {
    
        console.error( error );
    
    } );
    glloader.load( 'models/wooden_bench_remastered/scene.gltf', function ( gltf ) {
        gltf.scene.position.y = -0.5;
        gltf.scene.position.x = -1;
        gltf.scene.rotation.y = -Math.PI/2;
        gltf.scene.scale.set(1.5*gltf.scene.scale.x,1.5*gltf.scene.scale.y,1.5*gltf.scene.scale.z);
        //mesa.add( gltf.scene );
        scene.add(gltf.scene);
    
    }, undefined, function ( error ) {
    
        console.error( error );
    
    } );

    // Objeto contenedor
    //scene.add(mesa);
    //board = new THREE.Object3D();
    //board.position.y = 1.5;

    // Organizacion del grafo
    scene.add( board);
    //board.add( cubo );
    //board.add( esfera );
    //cubo.add( new THREE.AxesHelper(1) );
    //scene.add( new THREE.AxesHelper(3) );


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

//! Etapa de actualizacion para cada frame
function update()
{
    angulo += 0.01;
    //console.log(camera.position);
    //board.rotation.y = angulo;
}

//! Callback de refresco (se encola a si misma)
function render()
{
    requestAnimationFrame( render );
    update();
    renderer.render( scene, camera );
}