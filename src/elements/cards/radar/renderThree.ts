import clintUtil from "@/clientUtils";

const { three } = clintUtil.tools.three;

export const renderThree = (node: HTMLElement) => {
  const camera = new three.PerspectiveCamera(
    1,
    node.offsetWidth / node.offsetHeight,
    1,
    5000
  );
  camera.position.z = 1500;

  const scene = new three.Scene();
  scene.background = new three.Color(0x050505);
  scene.fog = new three.Fog(0x050505, 2000, 3500);

  const particles = 57600;

  const geometry = new three.BufferGeometry();

  const positions = [];
  const colors = [];

  const color = new three.Color();

  const n = 1000,
    n2 = n / 2;

  for (let i = 0; i < particles; i++) {
    // positions

    const x = Math.random() * n - n2;
    const y = Math.random() * n - n2;
    const z = Math.random() * n - n2;

    positions.push(x, y, z);

    // colors

    const vx = x / n + 0.5;
    const vy = y / n + 0.5;
    const vz = z / n + 0.5;

    // const vx = ( x / n ) ;
    // const vy = ( y / n ) ;
    // const vz = ( z / n ) ;

    color.setRGB(vx, vy, vz, three.SRGBColorSpace);

    colors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute(
    "position",
    new three.Float32BufferAttribute(positions, 3)
  );
  geometry.setAttribute("color", new three.Float32BufferAttribute(colors, 3));

  geometry.computeBoundingSphere();

  //

  const material = new three.PointsMaterial({
    size: 15,
    vertexColors: true,
  });

  const points = new three.Points(geometry, material);
  scene.add(points);

  //

  const renderer = new three.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(node.offsetWidth, node.offsetHeight);
  node.appendChild(renderer.domElement);
  //   const stats = new Stats();
  //   node.appendChild(stats.dom);

  //
  renderer.render(scene, camera);
  //   stats.update();
  return {
    refresh(data: Array<[number, number, number]>) {
      geometry!.setAttribute(
        "position",
        new three.Float32BufferAttribute(data.flat(), 3)
      );
      renderer!.render(scene!, camera!);
    },
  };
};
export default renderThree;
