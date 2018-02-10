var AMOUNT = 100;
var container, stats;
var camera, scene, renderer;

var video, image, imageContext,
    imageReflection, imageReflectionContext, imageReflectionGradient,
    texture, textureReflection;

var mesh;
var mouseX = 0;
var mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {

  container = document.createElement( 'div' );
      document.body.appendChild( container );
      var info = document.createElement( 'div' );
      info.style.position = 'absolute';
      info.style.top = '10px';
      info.style.width = '100%';
      info.style.textAlign = 'center';
      info.innerHTML = 'Muse';
      container.appendChild( info );


    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1500;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);


    //

    image = document.createElement('canvas');
    image.width = 1920;
    image.height = 180;

    imageContext = image.getContext('2d');
    imageContext.fillStyle = '#000000';
    imageContext.fillRect(0, 0, 480, 204);

    texture = new THREE.Texture(image);

    var material = new THREE.MeshBasicMaterial({
        map: texture,
        overdraw: 0.5
    });

    imageReflection = document.createElement('canvas');
    imageReflection.width = 1920;
    imageReflection.height = 180;

    imageReflectionContext = imageReflection.getContext('2d');
    imageReflectionContext.fillStyle = '#000000';
    imageReflectionContext.fillRect(0, 0, 1920, 180);

    imageReflectionGradient = imageReflectionContext.createLinearGradient(0, 0, 0, 204);
    imageReflectionGradient.addColorStop(0.2, 'rgba(0, 0, 0, 1)');
    imageReflectionGradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');

    textureReflection = new THREE.Texture(imageReflection);

    var materialReflection = new THREE.MeshBasicMaterial({
        map: textureReflection,
        side: THREE.BackSide,
        overdraw: 0.5
    });

    //

    var plane = new THREE.PlaneGeometry(1920, 180, 4, 4);

    mesh = new THREE.Mesh(plane, material);
    mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.5;
    scene.add(mesh);

    mesh = new THREE.Mesh(plane, materialReflection);
    mesh.position.y = -306;
    mesh.rotation.x = -Math.PI;
    mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.5;
    scene.add(mesh);

    //

    var separation = 150;
    var amountx = 20;
    var amounty = 30;

    var PI2 = Math.PI * 2;
    var material = new THREE.SpriteCanvasMaterial({

        color: 0x0808080,
        program: function(context) {

            context.beginPath();
            context.arc(0, 0, 0.5, 0, PI2, true);
            context.fill();

        }

    });

    for (var ix = 0; ix < amountx; ix++) {

        for (var iy = 0; iy < amounty; iy++) {

            var sprite = new THREE.Sprite(material);
            sprite.position.x = ix * separation - ((amountx * separation) / 2);
            sprite.position.y = -153;
            sprite.position.z = iy * separation - ((amounty * separation) / 2);
            sprite.scale.setScalar(2);
            scene.add(sprite);

        }

    }

    renderer = new THREE.CanvasRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    stats = new Stats();
    container.appendChild(stats.dom);

    document.addEventListener('mousemove', onDocumentMouseMove, false);

    //

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseMove(event) {

    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY) * 0.2;

}

//

function animate() {

    requestAnimationFrame(animate);

    render();
    stats.update();

}
function handleKeyPress() {
  document.body.onkeyup = function(e) {
    if(e.keyCode == 32) {
      if(video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  }
}
function render() {
    if (!video) {
      video = document.getElementById('video');
    }
    if (!video) {
      return;
    }

    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);


    if (video.readyState === video.HAVE_ENOUGH_DATA) {

        imageContext.drawImage(video, 0, 0);

        if (texture) texture.needsUpdate = true;
        if (textureReflection) textureReflection.needsUpdate = true;

    }

    imageReflectionContext.drawImage(image, 0, 0);
    imageReflectionContext.fillStyle = imageReflectionGradient;
    imageReflectionContext.fillRect(0, 0, 1920, 180);

    renderer.render(scene, camera);

}
