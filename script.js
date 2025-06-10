const canvas = document.querySelector("#solarCanvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 100;

//Lighting
const light = new THREE.PointLight(0xffffff, 2);
scene.add(light);

//Sun
const sunGeo = new THREE.SphereGeometry(5, 32, 32);
const sunMat = new THREE.MeshBasicMaterial({ color: 0xFDB813 });
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

//Planet data
const planetData = [
  { name: "Mercury", radius: 0.5, distance: 8, speed: 0.02, color: 0xaaaaaa },
  { name: "Venus",   radius: 0.8, distance: 12, speed: 0.015, color: 0xffcc99 },
  { name: "Earth",   radius: 1, distance: 16, speed: 0.01, color: 0x3366ff },
  { name: "Mars",    radius: 0.9, distance: 20, speed: 0.008, color: 0xff3300 },
  { name: "Jupiter", radius: 2.5, distance: 28, speed: 0.005, color: 0xff9966 },
  { name: "Saturn",  radius: 2, distance: 36, speed: 0.003, color: 0xffcc66 },
  { name: "Uranus",  radius: 1.5, distance: 42, speed: 0.002, color: 0x66ccff },
  { name: "Neptune", radius: 1.4, distance: 48, speed: 0.001, color: 0x3366cc }
];

const planets = [];
const speeds = {};

planetData.forEach(data => {
  const geo = new THREE.SphereGeometry(data.radius, 32, 32);
  const mat = new THREE.MeshStandardMaterial({ color: data.color });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.x = data.distance;
  scene.add(mesh);
  planets.push({ mesh, ...data, angle: 0 });

  speeds[data.name] = data.speed;

  //UI Control
  const controlsDiv = document.getElementById("controls");
  const label = document.createElement("label");
  label.innerText = `${data.name} Speed: `;
  const input = document.createElement("input");
  input.type = "range";
  input.min = 0;
  input.max = 0.05;
  input.step = 0.001;
  input.value = data.speed;
  input.addEventListener("input", () => {
    speeds[data.name] = parseFloat(input.value);
  });
  controlsDiv.appendChild(label);
  controlsDiv.appendChild(input);
  controlsDiv.appendChild(document.createElement("br"));
});

//Animation loop
function animate() {
  requestAnimationFrame(animate);
  planets.forEach(p => {
    p.angle += speeds[p.name];
    p.mesh.position.x = Math.cos(p.angle) * p.distance;
    p.mesh.position.z = Math.sin(p.angle) * p.distance;
  });
  renderer.render(scene, camera);
}

animate();

//Responsive
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
});
