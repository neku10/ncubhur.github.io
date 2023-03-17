// Modulos necesarios
import * as THREE from "../lib/three.module.js";
import {GLTFLoader} from "../lib/GLTFLoader.module.js";
import {OrbitControls} from "../lib/OrbitControls.module.js";
import {TWEEN} from "../lib/tween.module.min.js";

// Variables de consenso
let renderer, scene, camera;

// Otras globales
let cameraControls, effectController;
let mesa;
let board;
let piezas;
let areasClicables;
let estadoTablero;
let jugador;
let contador;
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

    
    //renderer.domElement.addEventListener('dblclick', animate );
    renderer.domElement.addEventListener('dblclick', onClick, false);

}


//! Carga de objetos y construccion del grafo
function loadScene()
{
    
    const path ="./images/";
    const material = new THREE.MeshBasicMaterial({color: 'yellow', wireframe: true});
    board = new THREE.Object3D();
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


    //Area clicable
    const geoCubo = new THREE.BoxGeometry( 0.15,0.03,0.15 );
    areasClicables = new THREE.Group();

        //PRIMERA COLUMNA
    const cuboNE = new THREE.Mesh( geoCubo, material );
    cuboNE.position.x = 0.175;
    cuboNE.position.y = 0.05;
    cuboNE.position.z = -0.175;
    areasClicables.add(cuboNE);

    const cuboE = new THREE.Mesh( geoCubo, material );
    cuboE.position.y = 0.05;
    cuboE.position.z = -0.175;
    areasClicables.add(cuboE);

    const cuboSE = new THREE.Mesh( geoCubo, material );
    cuboSE.position.y = 0.05;
    cuboSE.position.x = -0.175;
    cuboSE.position.z = -0.175;
    areasClicables.add(cuboSE);

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
    const cuboNO = new THREE.Mesh( geoCubo, material );
    cuboNO.position.x = 0.175;
    cuboNO.position.y = 0.05;
    cuboNO.position.z = 0.175;
    areasClicables.add(cuboNO);

    const cuboO = new THREE.Mesh( geoCubo, material );
    cuboO.position.y = 0.05;
    cuboO.position.z = 0.175;
    areasClicables.add(cuboO);

    const cuboSO = new THREE.Mesh( geoCubo, material );
    cuboSO.position.x = -0.175;
    cuboSO.position.y = 0.05;
    cuboSO.position.z = 0.175;
    areasClicables.add(cuboSO);

    board.add(areasClicables);
    console.log('creaareas');



    // Importar un modelo en gltf
    const glloader = new GLTFLoader();

    glloader.load( 'models/tic_tac_toe/tablero.gltf', function ( gltf ) {
        //gltf.scene.position.y = 1;
        //gltf.scene.position.x = -1;
        gltf.scene.rotation.y = Math.PI/2;
        gltf.scene.name = 'tablero';
        board.add(gltf.scene)
        //esfera.add( gltf.scene );
        //scene.add(gltf.scene);
    
    }, undefined, function ( error ) {
    
        console.error( error );
    
    } );
    glloader.load( 'models/tic_tac_toe/cruz.gltf', function ( gltf ) {
        //gltf.scene.position.y = 1;
        gltf.scene.rotation.y = -Math.PI/2;
        //gltf.scene.position.x = 1;
        gltf.scene.name = 'cruz';
        //cubo.add( gltf.scene );
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
        //cubo.add( gltf.scene );
        //scene.add(gltf.scene);
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
    piezas = [cruz1, circulo1, cruz2, circulo2, cruz3, circulo3, cruz4, circulo4, cruz5];
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
function onClick(event){
    let x= event.clientX;
    let y = event.clientY;
    x = ( x / window.innerWidth ) * 2 - 1;
    y = -( y / window.innerHeight ) * 2 + 1;
    const rayo = new THREE.Raycaster();
    rayo.setFromCamera(new THREE.Vector2(x,y), camera);
    let intersecciones = rayo.intersectObjects(areasClicables.children,true);
    console.log('hola mundito');
    console.log(intersecciones);

    if( intersecciones.length > 0 ){
        let index = areasClicables.children.findIndex((c) => c.uuid === intersecciones[0].object.uuid);
        console.log(intersecciones[0].object.position);
        addPiece(intersecciones[0]);
        areasClicables.children.splice(index,1);
        contador++;
    }
}
//añade una pieza al tablero en el area clicada con doble click
function addPiece(casilla){
    console.log('jugador actual = ', jugador);
    if (jugador == 'x'){
        jugador = 'o';

    }else{
        jugador = 'x';

    }
    //movemos la pieza y la añadimos al tablero
    piezas[contador].position.copy(casilla.object.position);
    board.add(piezas[contador]);
}

function animate(event)
{
    // Capturar y normalizar
    let x= event.clientX;
    let y = event.clientY;
    x = ( x / window.innerWidth ) * 2 - 1;
    y = -( y / window.innerHeight ) * 2 + 1;
    let intersectionPoint = new THREE.Vector3();

    // Construir el rayo y detectar la interseccion
    const rayo = new THREE.Raycaster();
    rayo.setFromCamera(new THREE.Vector2(x,y), camera);
    const tablero = scene.getObjectByName('tablero');
    //const robot = scene.getObjectByName('robota');
    let intersecciones = rayo.intersectObjects(tablero.children,true);
    let planeNormal = new THREE.Vector3();
    planeNormal.copy(camera.position).normalize();
    let plane = new THREE.Plane();
    plane.setFromNormalAndCoplanarPoint(planeNormal,scene.position);
    //var vec = rayo.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0)), intersectionPoint);
    rayo.ray.intersectPlane(plane, intersectionPoint);

    

    if( intersecciones.length > 0 ){
        /*new TWEEN.Tween( tablero.position ).
        to( {x:[0,0],y:[3,1],z:[0,0]}, 2000 ).
        interpolation( TWEEN.Interpolation.Bezier ).
        easing( TWEEN.Easing.Bounce.Out ).
        start();
        */
        //cruz.position.x=intersectionPoint.x;
        //cruz.position.y=intersectionPoint.y;
        //cruz.position.z=intersectionPoint.z;
        
        board.add( cruz);
        cruz.position.copy(intersectionPoint);
        
    }
/*
    intersecciones = rayo.intersectObjects(robot.children,true);

    if( intersecciones.length > 0 ){
        new TWEEN.Tween( robot.rotation ).
        to( {x:[0,0],y:[Math.PI,-Math.PI/2],z:[0,0]}, 5000 ).
        interpolation( TWEEN.Interpolation.Linear ).
        easing( TWEEN.Easing.Exponential.InOut ).
        start();
    }*/

    
    

}

//! Etapa de actualizacion para cada frame
function update()
{
    angulo += 0.01;
    //console.log(camera.position);
    //board.rotation.y = angulo;   
    TWEEN.update();
}

//! Callback de refresco (se encola a si misma)
function render()
{
    requestAnimationFrame( render );
    update();
    renderer.render( scene, camera );
}