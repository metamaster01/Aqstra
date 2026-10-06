// // "use client";

// // /**
// //  * Scroll-driven MacBook: back of closed laptop -> spins around -> lid opens
// //  * -> camera pushes into the screen -> poster / video plays on the screen.
// //  *
// //  * npm i three @react-three/fiber @react-three/drei framer-motion
// //  * npm i -D @types/three
// //  *
// //  * /public: macbook.glb, poster-light.png, poster-dark.png, poster-video.mp4 (later)
// //  */

// // import { Suspense, useMemo, useRef } from "react";
// // import * as THREE from "three";
// // import { Canvas, useFrame, useThree } from "@react-three/fiber";
// // import { ContactShadows, Environment, useGLTF, useTexture } from "@react-three/drei";
// // import {
// //   motion,
// //   useInView,
// //   useReducedMotion,
// //   useScroll,
// //   useTransform,
// //   type MotionValue,
// // } from "framer-motion";

// // /* ───────────────────────── CONFIG (tweak here) ───────────────────────── */

// // const MODEL_SRC = "/macbook.glb";
// // const POSTER_LIGHT = "/poster-light.png";
// // const POSTER_DARK = "/poster-dark.png";
// // const VIDEO_SRC = "/poster-video.mp4";
// // const HAS_VIDEO = false; // flip to true once poster-video.mp4 exists

// // // Logs the model's node names to the browser console so we can target the
// // // lid + screen exactly. Turn off when everything works.
// // const DEBUG = true;

// // // Exact node names from the console log. null = best-effort auto-detect.
// // const LID_NODE: string | null = null; // the node that contains the whole lid (screen + back)
// // const SCREEN_MESH: string | null = null; // the mesh that should show the video

// // const LID_AXIS: "x" | "y" | "z" = "x"; // hinge axis
// // const LID_CLOSE_DELTA = -1.75; // radians to rotate from the model's rest pose to closed. Flip sign if it folds the wrong way
// // const START_YAW = -2.4; // initial spin of the laptop (radians) before it turns to face you
// // const MODEL_YAW = 0; // add Math.PI if the model faces away at the end
// // const TARGET_WIDTH = 4; // model is scaled to this width (world units)
// // const SCREEN_Y = 0.5; // where the camera looks at the end (raise/lower to center the screen)
// // const CAM_Y_START = 2.6; // camera height at the start (looking down on the closed lid)
// // const CAM_Y_END = 0.45;

// // const SCROLL_LENGTH = "h-[360vh]"; // how long the pinned scroll lasts

// // /* ───────────────────────────── 3D scene ───────────────────────────── */

// // type Rig = {
// //   model: THREE.Object3D;
// //   lid?: THREE.Object3D;
// //   mat?: THREE.MeshBasicMaterial;
// //   restRot: number;
// //   floorY: number;
// // };

// // function Laptop({
// //   progress,
// //   reduce,
// // }: {
// //   progress: MotionValue<number>;
// //   reduce: boolean;
// // }) {
// //   const gltf = useGLTF(MODEL_SRC);
// //   const isDark = useMemo(
// //     () => document.documentElement.classList.contains("dark"),
// //     []
// //   );
// //   const poster = useTexture(isDark ? POSTER_DARK : POSTER_LIGHT);
// //   const group = useRef<THREE.Group>(null);
// //   const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
// //   const size = useThree((s) => s.size);

// //   // video + texture (only when a video exists and motion is allowed)
// //   const video = useMemo(() => {
// //     if (!HAS_VIDEO || reduce) return null;
// //     const v = document.createElement("video");
// //     v.src = VIDEO_SRC;
// //     v.crossOrigin = "anonymous";
// //     v.loop = true;
// //     v.muted = true;
// //     v.playsInline = true;
// //     v.preload = "auto";
// //     return v;
// //   }, [reduce]);

// //   const videoTex = useMemo(() => {
// //     if (!video) return null;
// //     const t = new THREE.VideoTexture(video);
// //     t.flipY = false; // glTF UV convention
// //     t.colorSpace = THREE.SRGBColorSpace;
// //     return t;
// //   }, [video]);

// //   const rig = useMemo<Rig>(() => {
// //     poster.flipY = false;
// //     poster.colorSpace = THREE.SRGBColorSpace;
// //     poster.needsUpdate = true;

// //     const model = gltf.scene.clone(true);
// //     const found: { lid?: THREE.Object3D; screen?: THREE.Mesh } = {};
// //     const lines: string[] = [];

// //     model.traverse((o) => {
// //       if (DEBUG) {
// //         const depth = (() => {
// //           let d = 0;
// //           let p = o.parent;
// //           while (p) (d++, (p = p.parent));
// //           return d;
// //         })();
// //         lines.push(`${"  ".repeat(depth)}${o.type}: "${o.name}"`);
// //       }
// //       if (!found.lid) {
// //         const hit = LID_NODE ? o.name === LID_NODE : /lid|display|screen/i.test(o.name);
// //         if (hit) found.lid = o;
// //       }
// //       if (!found.screen && (o as THREE.Mesh).isMesh) {
// //         const hit = SCREEN_MESH ? o.name === SCREEN_MESH : /screen|display/i.test(o.name);
// //         if (hit) found.screen = o as THREE.Mesh;
// //       }
// //     });

// //     if (DEBUG) {
// //       console.log("[MacbookShowcase] node tree:\n" + lines.join("\n"));
// //       console.log("[MacbookShowcase] lid:", found.lid?.name, "| screen:", found.screen?.name);
// //     }

// //     // Screen shows the poster / video at true brightness (unlit material)
// //     let mat: THREE.MeshBasicMaterial | undefined;
// //     if (found.screen) {
// //       mat = new THREE.MeshBasicMaterial({ map: poster, toneMapped: false });
// //       found.screen.material = mat;
// //     }

// //     // normalize: scale to TARGET_WIDTH and center at the origin
// //     const box = new THREE.Box3().setFromObject(model);
// //     const sz = box.getSize(new THREE.Vector3());
// //     const c = box.getCenter(new THREE.Vector3());
// //     const s = TARGET_WIDTH / Math.max(sz.x, sz.z);
// //     model.scale.multiplyScalar(s);
// //     model.position.set(-c.x * s, -c.y * s, -c.z * s);

// //     return {
// //       model,
// //       lid: found.lid,
// //       mat,
// //       restRot: found.lid ? found.lid.rotation[LID_AXIS] : 0,
// //       floorY: (-sz.y * s) / 2,
// //     };
// //   }, [gltf, poster]);

// //   useFrame((_, dt) => {
// //     const g = group.current;
// //     if (!g) return;

// //     const p = reduce ? 1 : progress.get();
// //     const ss = (a: number, b: number) => THREE.MathUtils.smoothstep(p, a, b);
// //     const spin = ss(0, 0.4); // turn around
// //     const open = ss(0.3, 0.68); // lid opens
// //     const dolly = ss(0.62, 1); // camera pushes in
// //     const damp = THREE.MathUtils.damp;
// //     const lerp = THREE.MathUtils.lerp;

// //     g.rotation.y = damp(g.rotation.y, MODEL_YAW + (1 - spin) * START_YAW, 5, dt);

// //     if (rig.lid) {
// //       rig.lid.rotation[LID_AXIS] = damp(
// //         rig.lid.rotation[LID_AXIS],
// //         rig.restRot + (1 - open) * LID_CLOSE_DELTA,
// //         6,
// //         dt
// //       );
// //     }

// //     // camera: frame so the open screen fills ~the viewport width at the end
// //     const aspect = size.width / size.height;
// //     const fov = THREE.MathUtils.degToRad(camera.fov);
// //     const near = (TARGET_WIDTH * 1.08) / (2 * Math.tan(fov / 2) * Math.min(aspect, 1.8));
// //     const far = near * 2.4;
// //     const z = lerp(far, near, dolly);
// //     const y = lerp(CAM_Y_START, CAM_Y_END, dolly);
// //     camera.position.y = damp(camera.position.y, y, 5, dt);
// //     camera.position.z = damp(camera.position.z, z, 5, dt);
// //     camera.lookAt(0, lerp(0, SCREEN_Y, dolly), 0);

// //     // play the video only when the lid is open
// //     if (video && videoTex && rig.mat) {
// //       if (open > 0.97 && video.paused) video.play().catch(() => {});
// //       if (open < 0.8 && !video.paused) video.pause();
// //       rig.mat.map = open > 0.97 && video.readyState >= 2 ? videoTex : poster;
// //     }
// //   });

// //   return (
// //     <>
// //       <group ref={group}>
// //         <primitive object={rig.model} />
// //       </group>
// //       <ContactShadows
// //         position={[0, rig.floorY, 0]}
// //         opacity={0.55}
// //         scale={14}
// //         blur={2.6}
// //         far={4}
// //       />
// //     </>
// //   );
// // }

// // useGLTF.preload(MODEL_SRC);

// // /* ─────────────────────────── Section wrapper ─────────────────────────── */

// // export function MacbookShowcase() {
// //   const reduce = !!useReducedMotion();
// //   const outer = useRef<HTMLDivElement>(null);
// //   const inView = useInView(outer, { margin: "300px 0px" });

// //   const { scrollYProgress } = useScroll({
// //     target: outer,
// //     offset: ["start start", "end end"],
// //   });

// //   const headOpacity = useTransform(scrollYProgress, [0, 0.4, 0.62], [1, 1, 0]);
// //   const headY = useTransform(scrollYProgress, [0.4, 0.62], [0, -40]);

// //   return (
// //     <section
// //       ref={outer}
// //       className={`relative bg-[#050d1f] text-white ${reduce ? "h-svh" : SCROLL_LENGTH}`}
// //     >
// //       <div className="sticky top-0 h-svh overflow-hidden">
// //         <div
// //           aria-hidden
// //           className="pointer-events-none absolute left-1/2 top-1/2 h-[620px] w-[min(1100px,120%)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1d4ed8]/30 blur-[140px]"
// //         />

// //         <motion.div
// //           style={reduce ? undefined : { opacity: headOpacity, y: headY }}
// //           className="pointer-events-none absolute inset-x-0 top-[9svh] z-10 mx-auto max-w-[680px] px-6 text-center"
// //         >
// //           <h2 className="font-display text-[32px] font-extrabold leading-[1.1] tracking-[-0.03em] sm:text-[44px] lg:text-[52px]">
// //             See the difference precision makes.
// //           </h2>
// //           <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
// //             Give your team a focused view of the prospects worth pursuing.
// //           </p>
// //         </motion.div>

// //         <div
// //           role="img"
// //           aria-label="MacBook opening to show the MetaMaster prospect list"
// //           className="absolute inset-0"
// //         >
// //           <Canvas
// //             dpr={[1, 2]}
// //             frameloop={inView ? "always" : "never"}
// //             camera={{ fov: 35, position: [0, CAM_Y_START, 10] }}
// //             gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
// //           >
// //             <ambientLight intensity={0.4} />
// //             <Suspense fallback={null}>
// //               <Environment preset="studio" />
// //               <Laptop progress={scrollYProgress} reduce={reduce} />
// //             </Suspense>
// //           </Canvas>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }








// "use client";

// /**
//  * Scroll-driven MacBook: closed laptop -> turns to face you -> lid opens ->
//  * camera pushes into the screen -> video (or poster) plays on the screen.
//  *
//  * npm i three @react-three/fiber @react-three/drei framer-motion
//  * npm i -D @types/three
//  *
//  * /public: macbook.glb, demo.mp4, poster-light.png, poster-dark.png
//  */

// import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from "react";
// import * as THREE from "three";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import { ContactShadows, Environment, useGLTF, useTexture } from "@react-three/drei";
// import {
//   motion,
//   useInView,
//   useReducedMotion,
//   useScroll,
//   useTransform,
//   type MotionValue,
// } from "framer-motion";

// /* ───────────────────────── CONFIG (tweak here) ───────────────────────── */

// const MODEL_SRC = "/macbook-4.glb";
// const POSTER_LIGHT = "/poster-light.png";
// const POSTER_DARK = "/poster-dark.png";
// const VIDEO_SRC = "/demo.mp4";
// const HAS_VIDEO = true; // false = always show the poster image on the screen

// const NAV_H = 58; // your navbar height in px (same as the hero's calc(100svh-58px))

// // Logs the node tree + screen candidates to the console. Turn off when done.
// const DEBUG = true;

// const LID_NODE: string | null = null;
// const SCREEN_MESH: string | null = null; // set this if auto-detect picks the wrong mesh

// const LID_AXIS: "x" | "y" | "z" = "x";
// const LID_CLOSE_DELTA = -1.75;
// const START_YAW = -2.4;
// const MODEL_YAW = 0;
// const TARGET_WIDTH = 4;
// const SCREEN_Y = 0.5;
// const CAM_Y_START = 2.6;
// const CAM_Y_END = 0.45;
// const FAR_MULT = 3; // bigger = laptop smaller at the start (more room under the title)

// const SCROLL_LENGTH = "h-[360vh]";

// // Scroll timeline (0..1)
// const T_SPIN: [number, number] = [0, 0.4];
// const T_OPEN: [number, number] = [0.3, 0.68];
// const T_DOLLY: [number, number] = [0.62, 1];
// const T_TITLE_FADE: [number, number] = [0.5, 0.78]; // title is fully gone by 0.78

// /* ───────────────────────────── helpers ───────────────────────────── */

// /** Crop the texture to fill the screen without stretching (like object-fit: cover). */
// function fitCover(tex: THREE.Texture, imgAspect: number, screenAspect: number) {
//   tex.repeat.set(1, 1);
//   tex.offset.set(0, 0);
//   if (imgAspect > screenAspect) {
//     const r = screenAspect / imgAspect;
//     tex.repeat.x = r;
//     tex.offset.x = (1 - r) / 2;
//   } else {
//     const r = imgAspect / screenAspect;
//     tex.repeat.y = r;
//     tex.offset.y = (1 - r) / 2;
//   }
//   tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
//   tex.needsUpdate = true;
// }

// type Rig = {
//   model: THREE.Object3D;
//   lid?: THREE.Object3D;
//   mat?: THREE.MeshBasicMaterial;
//   restRot: number;
//   floorY: number;
//   screenAspect: number;
//   canFit: boolean;
//   flipY: boolean;
// };

// /* ───────────────────────────── 3D scene ───────────────────────────── */

// function Laptop({
//   progress,
//   reduce,
//   active,
//   shiftRef,
// }: {
//   progress: MotionValue<number>;
//   reduce: boolean;
//   active: boolean;
//   shiftRef: React.MutableRefObject<number>;
// }) {
//   const gltf = useGLTF(MODEL_SRC);
//   const isDark = useMemo(() => document.documentElement.classList.contains("dark"), []);
//   const poster = useTexture(isDark ? POSTER_DARK : POSTER_LIGHT);
//   const group = useRef<THREE.Group>(null);
//   const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
//   const size = useThree((s) => s.size);
//   const shift = useRef(0);
//   const fitted = useRef(false);

//   const video = useMemo(() => {
//     if (!HAS_VIDEO || reduce) return null;
//     const v = document.createElement("video");
//     v.src = VIDEO_SRC;
//     v.crossOrigin = "anonymous";
//     v.loop = true;
//     v.muted = true;
//     v.playsInline = true;
//     v.preload = "auto";
//     return v;
//   }, [reduce]);

//   const videoTex = useMemo(() => {
//     if (!video) return null;
//     const t = new THREE.VideoTexture(video);
//     t.colorSpace = THREE.SRGBColorSpace;
//     return t;
//   }, [video]);

//   // stop the video when the section is off screen
//   useEffect(() => {
//     if (!active && video && !video.paused) video.pause();
//   }, [active, video]);

//   const rig = useMemo<Rig>(() => {
//     const model = gltf.scene.clone(true);
//     const found: { lid?: THREE.Object3D } = {};
//     const lines: string[] = [];
//     const cands: { mesh: THREE.Mesh; score: number; area: number; aspect: number }[] = [];
//     const v3 = new THREE.Vector3();

//     model.traverse((o) => {
//       if (DEBUG) {
//         let d = 0;
//         for (let p = o.parent; p; p = p.parent) d++;
//         lines.push(`${"  ".repeat(d)}${o.type}: "${o.name}"`);
//       }
//       if (!found.lid) {
//         const hit = LID_NODE ? o.name === LID_NODE : /lid|display|screen/i.test(o.name);
//         if (hit) found.lid = o;
//       }

//       const m = o as THREE.Mesh;
//       if (!m.isMesh) return;
//       const srcMat = (Array.isArray(m.material) ? m.material[0] : m.material) as THREE.MeshStandardMaterial;
//       m.geometry.computeBoundingBox();
//       const dims = m.geometry.boundingBox!.getSize(v3).toArray().sort((a, b) => b - a);
//       const flat = dims[2] / Math.max(dims[0], 1e-6);
//       const aspect = dims[0] / Math.max(dims[1], 1e-6);
//       const named = SCREEN_MESH
//         ? o.name === SCREEN_MESH
//         : /screen|display|lcd|monitor|wallpaper/i.test(`${o.name} ${srcMat?.name ?? ""}`);
//       const hasMap = !!(srcMat?.map || srcMat?.emissiveMap);
//       const score =
//         (named ? 10 : 0) + (hasMap ? 3 : 0) + (flat < 0.06 ? 2 : 0) + (aspect > 1.3 && aspect < 1.9 ? 2 : 0);
//       cands.push({ mesh: m, score, area: dims[0] * dims[1], aspect });
//     });

//     // best screen candidate: highest score, then largest area
//     cands.sort((a, b) => b.score - a.score || b.area - a.area);
//     const best = SCREEN_MESH ? cands.find((c) => c.mesh.name === SCREEN_MESH) : cands[0];
//     const screen = best && best.score >= 5 ? best : undefined;

//     if (DEBUG) {
//       console.log("[MacbookShowcase] node tree:\n" + lines.join("\n"));
//       console.log(
//         "[MacbookShowcase] screen candidates:",
//         cands.slice(0, 6).map((c) => `${c.mesh.name || "(unnamed)"} score=${c.score} aspect=${c.aspect.toFixed(2)}`)
//       );
//       console.log("[MacbookShowcase] lid:", found.lid?.name, "| screen:", screen?.mesh.name ?? "NOT FOUND");
//     }

//     let mat: THREE.MeshBasicMaterial | undefined;
//     let canFit = false;
//     let flipY = false;
//     let screenAspect = 1.6;

//     if (screen) {
//       const srcMat = (Array.isArray(screen.mesh.material)
//         ? screen.mesh.material[0]
//         : screen.mesh.material) as THREE.MeshStandardMaterial;
//       const orig = srcMat?.map ?? srcMat?.emissiveMap ?? null;
//       flipY = orig ? orig.flipY : false;
//       canFit = !orig || (orig.rotation === 0 && orig.repeat.x === 1 && orig.repeat.y === 1);
//       screenAspect = screen.aspect;

//       poster.flipY = flipY;
//       poster.colorSpace = THREE.SRGBColorSpace;
//       const img = poster.image as { width: number; height: number };
//       if (canFit) fitCover(poster, img.width / img.height, screenAspect);
//       poster.needsUpdate = true;

//       mat = new THREE.MeshBasicMaterial({ map: poster, toneMapped: false });
//       screen.mesh.material = mat;
//     }

//     // normalize: scale + center
//     const box = new THREE.Box3().setFromObject(model);
//     const sz = box.getSize(new THREE.Vector3());
//     const c = box.getCenter(new THREE.Vector3());
//     const s = TARGET_WIDTH / Math.max(sz.x, sz.z);
//     model.scale.multiplyScalar(s);
//     model.position.set(-c.x * s, -c.y * s, -c.z * s);

//     return {
//       model,
//       lid: found.lid,
//       mat,
//       restRot: found.lid ? found.lid.rotation[LID_AXIS] : 0,
//       floorY: (-sz.y * s) / 2,
//       screenAspect,
//       canFit,
//       flipY,
//     };
//   }, [gltf, poster]);

//   useFrame((_, dt) => {
//     const g = group.current;
//     if (!g) return;

//     const p = reduce ? 1 : progress.get();
//     const ss = (r: [number, number]) => THREE.MathUtils.smoothstep(p, r[0], r[1]);
//     const spin = ss(T_SPIN);
//     const open = ss(T_OPEN);
//     const dolly = ss(T_DOLLY);
//     const release = ss(T_TITLE_FADE);
//     const damp = THREE.MathUtils.damp;
//     const lerp = THREE.MathUtils.lerp;

//     g.rotation.y = damp(g.rotation.y, MODEL_YAW + (1 - spin) * START_YAW, 5, dt);

//     if (rig.lid) {
//       rig.lid.rotation[LID_AXIS] = damp(
//         rig.lid.rotation[LID_AXIS],
//         rig.restRot + (1 - open) * LID_CLOSE_DELTA,
//         6,
//         dt
//       );
//     }

//     // camera distance so the open screen fills the width at the end
//     const aspect = size.width / size.height;
//     const fov = THREE.MathUtils.degToRad(camera.fov);
//     const near = (TARGET_WIDTH * 1.08) / (2 * Math.tan(fov / 2) * Math.min(aspect, 1.8));
//     const far = near * FAR_MULT;
//     camera.position.y = damp(camera.position.y, lerp(CAM_Y_START, CAM_Y_END, dolly), 5, dt);
//     camera.position.z = damp(camera.position.z, lerp(far, near, dolly), 5, dt);

//     // push the whole scene down by the title height so nothing overlaps, release as the title fades
//     shift.current = damp(shift.current, shiftRef.current * (1 - release), 5, dt);
//     camera.setViewOffset(size.width, size.height, 0, -shift.current, size.width, size.height);
//     camera.lookAt(0, lerp(0, SCREEN_Y, dolly), 0);

//     // video on the screen, only while the lid is open
//     if (video && videoTex && rig.mat) {
//       if (!fitted.current && video.readyState >= 1 && video.videoHeight) {
//         videoTex.flipY = rig.flipY;
//         if (rig.canFit) fitCover(videoTex, video.videoWidth / video.videoHeight, rig.screenAspect);
//         videoTex.needsUpdate = true;
//         fitted.current = true;
//       }
//       if (active && open > 0.97 && video.paused) video.play().catch(() => {});
//       if (open < 0.8 && !video.paused) video.pause();
//       rig.mat.map = open > 0.97 && video.readyState >= 2 && fitted.current ? videoTex : poster;
//     }
//   });

//   return (
//     <>
//       <group ref={group}>
//         <primitive object={rig.model} />
//       </group>
//       <ContactShadows position={[0, rig.floorY, 0]} opacity={0.55} scale={14} blur={2.6} far={4} />
//     </>
//   );
// }

// useGLTF.preload(MODEL_SRC);

// /* ─────────────────────────── Section wrapper ─────────────────────────── */

// export function MacbookShowcase() {
//   const reduce = !!useReducedMotion();
//   const outer = useRef<HTMLDivElement>(null);
//   const headRef = useRef<HTMLDivElement>(null);
//   const shiftRef = useRef(0);
//   const inView = useInView(outer, { margin: "300px 0px" });

//   const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });

//   // Title fades out while the camera zooms in, and is gone before the zoom ends
//   const headOpacity = useTransform(scrollYProgress, [T_TITLE_FADE[0] - 0.08, T_TITLE_FADE[1]], [1, 0]);
//   const headY = useTransform(scrollYProgress, [T_TITLE_FADE[0] - 0.08, T_TITLE_FADE[1]], [0, -36]);

//   // measure the title block so the laptop is framed below it
//   useLayoutEffect(() => {
//     const el = headRef.current;
//     if (!el) return;
//     const measure = () => {
//       shiftRef.current = (el.offsetTop + el.offsetHeight + 12) / 2;
//     };
//     measure();
//     const ro = new ResizeObserver(measure);
//     ro.observe(el);
//     return () => ro.disconnect();
//   }, []);

//   return (
//     <section
//       ref={outer}
//       className={`relative bg-[#050d1f] text-white ${reduce ? "" : SCROLL_LENGTH}`}
//       style={reduce ? { height: `calc(100svh - ${NAV_H}px)` } : undefined}
//     >
//       <div
//         className="sticky overflow-hidden"
//         style={{ top: NAV_H, height: `calc(100svh - ${NAV_H}px)` }}
//       >
//         <div
//           aria-hidden
//           className="pointer-events-none absolute left-1/2 top-1/2 h-[620px] w-[min(1100px,120%)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1d4ed8]/30 blur-[140px]"
//         />

//         <motion.div
//           ref={headRef}
//           style={reduce ? { top: 28 } : { opacity: headOpacity, y: headY, top: 28 }}
//           className="pointer-events-none absolute inset-x-0 z-10 mx-auto max-w-[900px] px-6 text-center"
//         >
//           {/* inline sizes: a global h2/p rule in the site CSS was overriding the utility classes */}
//           <h2
//             className="font-display font-extrabold"
//             style={{ fontSize: "clamp(28px, 4.2vw, 54px)", lineHeight: 1.08, letterSpacing: "-0.03em", margin: 0 }}
//           >
//             See the difference precision makes.
//           </h2>
//           <p
//             className="text-white/60"
//             style={{ fontSize: "clamp(14px, 1.4vw, 18px)", lineHeight: 1.5, margin: "12px 0 0" }}
//           >
//             Give your team a focused view of the prospects worth pursuing.
//           </p>
//         </motion.div>

//         <div
//           role="img"
//           aria-label="MacBook opening to show the MetaMaster prospect list"
//           className="absolute inset-0"
//         >
//           <Canvas
//             dpr={[1, 2]}
//             frameloop={inView ? "always" : "never"}
//             camera={{ fov: 35, position: [0, CAM_Y_START, 10] }}
//             gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
//           >
//             <ambientLight intensity={0.4} />
//             <Suspense fallback={null}>
//               <Environment preset="studio" />
//               <Laptop progress={scrollYProgress} reduce={reduce} active={inView} shiftRef={shiftRef} />
//             </Suspense>
//           </Canvas>
//         </div>
//       </div>
//     </section>
//   );
// }



// "use client";

// /**
//  * Scroll-driven MacBook: closed laptop -> turns to face you -> lid opens ->
//  * camera pushes into the screen -> your video plays on the screen.
//  *
//  * npm i three @react-three/fiber @react-three/drei framer-motion
//  * npm i -D @types/three
//  *
//  * /public: macbook.glb, demo.mp4, poster-light.png, poster-dark.png
//  *
//  * - Video autoplays (muted) when the lid is open. If the browser blocks
//  *   autoplay, a Play button appears on the screen. Clicking the screen
//  *   also pauses / resumes the video.
//  * - The poster is only a fallback (no video / video fails / reduced motion).
//  * - To change the video: replace /public/demo.mp4 and hard-refresh (Ctrl+F5).
//  */

// import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
// import * as THREE from "three";
// import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
// import { ContactShadows, Environment, useGLTF, useTexture } from "@react-three/drei";
// import { useInView, useReducedMotion, useScroll, type MotionValue } from "framer-motion";

// /* ───────────────────────── CONFIG (tweak here) ───────────────────────── */

// const MODEL_SRC = "/macbook-3.glb";
// const POSTER_LIGHT = "/poster-light.png";
// const POSTER_DARK = "/poster-dark.png";
// const VIDEO_SRC = "/demo.mp4";
// const HAS_VIDEO = true;

// const NAV_H = 58;

// /**
//  * DEBUG = true: clicking the screen picks which mesh shows the video (and logs
//  * the name), and V / H flip the video vertically / horizontally (logs values
//  * to paste into FLIP_V / FLIP_H). Keep false in production.
//  */
// const DEBUG = false;

// const LID_NODE: string | null = null;
// const SCREEN_MESH: string | null = null; // null = auto (finds what you would click)

// const FLIP_V = false;
// const FLIP_H = false;

// const LID_AXIS: "x" | "y" | "z" = "x";
// const LID_CLOSE_DELTA = -1.75;
// const START_YAW = -2.4;
// const MODEL_YAW = 0;
// const TARGET_WIDTH = 4;
// const SCREEN_Y = 0.5;
// const CAM_Y_START = 2.6;
// const CAM_Y_END = 0.45;
// const FAR_MULT = 1.7; // laptop size at the start. Smaller number = bigger laptop
// const END_FILL = 1.0; // laptop size at the end. Smaller number = bigger/closer

// const SCROLL_LENGTH = "h-[360vh]";

// // Scroll timeline (0..1) of the pinned stage
// const T_SPIN: [number, number] = [0, 0.4];
// const T_OPEN: [number, number] = [0.3, 0.68];
// const T_DOLLY: [number, number] = [0.62, 1];
// const T_TITLE_FADE: [number, number] = [0.4, 0.58];

// /* ───────────────────────────── helpers ───────────────────────────── */

// function localAspect(geo: THREE.BufferGeometry) {
//   geo.computeBoundingBox();
//   const d = geo.boundingBox!.getSize(new THREE.Vector3()).toArray().sort((a, b) => b - a);
//   return d[0] / Math.max(d[1], 1e-6);
// }

// function uvSpan(geo: THREE.BufferGeometry) {
//   const uv = geo.attributes.uv;
//   if (!uv) return 0;
//   let u0 = Infinity, u1 = -Infinity, v0 = Infinity, v1 = -Infinity;
//   for (let i = 0; i < uv.count; i++) {
//     const u = uv.getX(i), v = uv.getY(i);
//     if (u < u0) u0 = u;
//     if (u > u1) u1 = u;
//     if (v < v0) v0 = v;
//     if (v > v1) v1 = v;
//   }
//   return Math.min(u1 - u0, v1 - v0);
// }

// const matOf = (m: THREE.Mesh) =>
//   (Array.isArray(m.material) ? m.material[0] : m.material) as THREE.MeshStandardMaterial;

// type Rig = {
//   model: THREE.Object3D;
//   lid?: THREE.Object3D;
//   mat?: THREE.MeshBasicMaterial;
//   restRot: number;
//   floorY: number;
//   screenAspect: number;
//   autoFlipU: boolean;
//   autoFlipV: boolean;
//   userFlipU: boolean;
//   userFlipV: boolean;
//   fitted: boolean;
//   firstFrame: boolean;
//   tried: boolean;
//   assign: (mesh: THREE.Mesh) => void;
//   place: (tex: THREE.Texture, imgAspect: number) => void;
// };

// /* ───────────────────────────── 3D scene ───────────────────────────── */

// function Laptop({
//   progress,
//   reduce,
//   active,
//   headRef,
//   shiftRef,
//   videoRef,
//   onNeedTap,
// }: {
//   progress: MotionValue<number>;
//   reduce: boolean;
//   active: boolean;
//   headRef: React.RefObject<HTMLDivElement | null>;
//   shiftRef: React.MutableRefObject<number>;
//   videoRef: React.MutableRefObject<HTMLVideoElement | null>;
//   onNeedTap: (v: boolean) => void;
// }) {
//   const gltf = useGLTF(MODEL_SRC);
//   const isDark = useMemo(() => document.documentElement.classList.contains("dark"), []);
//   const poster = useTexture(isDark ? POSTER_DARK : POSTER_LIGHT);
//   const group = useRef<THREE.Group>(null);
//   const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
//   const size = useThree((s) => s.size);
//   const smooth = useRef(reduce ? 0.66 : 0); // one smoothed progress drives EVERYTHING in lockstep

//   const video = useMemo(() => {
//     if (!HAS_VIDEO || reduce) return null;
//     const v = document.createElement("video");
//     v.src = VIDEO_SRC;
//     v.crossOrigin = "anonymous";
//     v.loop = true;
//     v.muted = true;
//     v.defaultMuted = true;
//     v.playsInline = true;
//     v.setAttribute("playsinline", "");
//     v.preload = "auto";
//     return v;
//   }, [reduce]);

//   const videoTex = useMemo(() => {
//     if (!video) return null;
//     const t = new THREE.VideoTexture(video);
//     t.colorSpace = THREE.SRGBColorSpace;
//     return t;
//   }, [video]);

//   useEffect(() => {
//     videoRef.current = video;
//     if (!video) return;
//     const playing = () => onNeedTap(false);
//     video.addEventListener("playing", playing);
//     return () => video.removeEventListener("playing", playing);
//   }, [video, videoRef, onNeedTap]);

//   useEffect(() => {
//     if (!active && video && !video.paused) video.pause();
//   }, [active, video]);

//   const rig = useMemo<Rig>(() => {
//     const model = gltf.scene.clone(true);
//     model.updateMatrixWorld(true);

//     const rig: Rig = {
//       model,
//       restRot: 0,
//       floorY: 0,
//       screenAspect: 1.6,
//       autoFlipU: false,
//       autoFlipV: false,
//       userFlipU: FLIP_H,
//       userFlipV: FLIP_V,
//       fitted: false,
//       firstFrame: false,
//       tried: false,
//       assign: () => {},
//       place: () => {},
//     };

//     rig.place = (tex, imgAspect) => {
//       tex.flipY = false;
//       tex.colorSpace = THREE.SRGBColorSpace;
//       tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
//       tex.repeat.set(1, 1);
//       tex.offset.set(0, 0);
//       if (imgAspect > rig.screenAspect) {
//         const r = rig.screenAspect / imgAspect;
//         tex.repeat.x = r;
//         tex.offset.x = (1 - r) / 2;
//       } else {
//         const r = imgAspect / rig.screenAspect;
//         tex.repeat.y = r;
//         tex.offset.y = (1 - r) / 2;
//       }
//       if (rig.autoFlipV !== rig.userFlipV) {
//         tex.offset.y += tex.repeat.y;
//         tex.repeat.y *= -1;
//       }
//       if (rig.autoFlipU !== rig.userFlipU) {
//         tex.offset.x += tex.repeat.x;
//         tex.repeat.x *= -1;
//       }
//       tex.needsUpdate = true;
//     };

//     rig.assign = (mesh) => {
//       const geo = mesh.geometry.clone();
//       mesh.geometry = geo;
//       mesh.updateWorldMatrix(true, false);

//       const pos = geo.attributes.position;
//       const p = new THREE.Vector3();
//       const xs: number[] = [];
//       const ys: number[] = [];
//       for (let i = 0; i < pos.count; i++) {
//         p.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
//         xs.push(p.x);
//         ys.push(p.y);
//       }
//       const x0 = Math.min(...xs), x1 = Math.max(...xs);
//       const y0 = Math.min(...ys), y1 = Math.max(...ys);

//       if (uvSpan(geo) <= 0.9) {
//         const uv = new Float32Array(pos.count * 2);
//         for (let i = 0; i < pos.count; i++) {
//           uv[i * 2] = (xs[i] - x0) / Math.max(x1 - x0, 1e-6);
//           uv[i * 2 + 1] = 1 - (ys[i] - y0) / Math.max(y1 - y0, 1e-6);
//         }
//         geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
//       }

//       const uvA = geo.attributes.uv;
//       let um = 0, vm = 0;
//       for (let i = 0; i < uvA.count; i++) {
//         um += uvA.getX(i);
//         vm += uvA.getY(i);
//       }
//       um /= uvA.count;
//       vm /= uvA.count;
//       const xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
//       let covU = 0, covV = 0;
//       for (let i = 0; i < uvA.count; i++) {
//         covU += (uvA.getX(i) - um) * (xs[i] - xm);
//         covV += (uvA.getY(i) - vm) * (ys[i] - ym);
//       }
//       rig.autoFlipU = covU < 0;
//       rig.autoFlipV = covV > 0;

//       rig.screenAspect = localAspect(geo);
//       const img = poster.image as { width: number; height: number };
//       rig.place(poster, img.width / img.height);

//       rig.mat?.dispose();
//       rig.mat = new THREE.MeshBasicMaterial({ map: poster, toneMapped: false, side: THREE.DoubleSide });
//       mesh.material = rig.mat;
//       rig.fitted = false;
//       rig.firstFrame = false;
//     };

//     // ---- find lid + screen ----
//     let lid: THREE.Object3D | undefined;
//     const lines: string[] = [];
//     const cands: { mesh: THREE.Mesh; score: number; area: number; aspect: number }[] = [];
//     const v3 = new THREE.Vector3();

//     model.traverse((o) => {
//       if (DEBUG) {
//         let d = 0;
//         for (let q = o.parent; q; q = q.parent) d++;
//         lines.push(`${"  ".repeat(d)}${o.type}: "${o.name}"`);
//       }
//       if (!lid && (LID_NODE ? o.name === LID_NODE : /lid|display|screen/i.test(o.name))) lid = o;

//       const m = o as THREE.Mesh;
//       if (!m.isMesh) return;
//       const mt = matOf(m);
//       m.geometry.computeBoundingBox();
//       const dims = m.geometry.boundingBox!.getSize(v3).toArray().sort((a, b) => b - a);
//       const flat = dims[2] / Math.max(dims[0], 1e-6);
//       const aspect = dims[0] / Math.max(dims[1], 1e-6);
//       const named = SCREEN_MESH
//         ? o.name === SCREEN_MESH
//         : /screen|display|lcd|monitor|wallpaper|glass|panel/i.test(`${o.name} ${mt?.name ?? ""}`);
//       const hasMap = !!(mt?.map || mt?.emissiveMap);
//       const c = mt?.color;
//       const dark = !!c && c.r * 0.2126 + c.g * 0.7152 + c.b * 0.0722 < 0.05;
//       const score =
//         (named ? 10 : 0) + (hasMap ? 3 : 0) + (dark ? 3 : 0) + (flat < 0.06 ? 2 : 0) + (aspect > 1.3 && aspect < 1.9 ? 2 : 0);
//       cands.push({ mesh: m, score, area: dims[0] * dims[1], aspect });
//     });

//     cands.sort(
//       (a, b) =>
//         b.score - a.score || Math.abs(a.aspect - 1.6) - Math.abs(b.aspect - 1.6) || b.area - a.area
//     );

//     // 1) explicit name  2) whatever you would click: a ray straight at the lid's center
//     // 3) best-scoring flat dark/textured mesh
//     let screen: THREE.Mesh | undefined;
//     let how = "";
//     if (SCREEN_MESH) {
//       screen = cands.find((c) => c.mesh.name === SCREEN_MESH)?.mesh;
//       how = "SCREEN_MESH";
//     }
//     if (!screen) {
//       const box = lid ? new THREE.Box3().setFromObject(lid) : new THREE.Box3().setFromObject(model);
//       const c = box.getCenter(new THREE.Vector3());
//       if (!lid) c.y = box.min.y + (box.max.y - box.min.y) * 0.7;
//       const rc = new THREE.Raycaster(new THREE.Vector3(c.x, c.y, box.max.z + 10), new THREE.Vector3(0, 0, -1));
//       const hit = rc.intersectObject(model, true).find((h) => (h.object as THREE.Mesh).isMesh);
//       if (hit) {
//         screen = hit.object as THREE.Mesh;
//         how = "ray at lid center";
//       }
//     }
//     if (!screen && cands[0] && cands[0].score >= 5) {
//       screen = cands[0].mesh;
//       how = "best score";
//     }

//     if (DEBUG) {
//       console.log("[MacbookShowcase] node tree:\n" + lines.join("\n"));
//       console.log("[MacbookShowcase] lid:", lid?.name, "| screen:", screen?.name ?? "NOT FOUND", `(${how})`);
//     }

//     rig.lid = lid;
//     rig.restRot = lid ? lid.rotation[LID_AXIS] : 0;
//     if (screen) rig.assign(screen);

//     const box = new THREE.Box3().setFromObject(model);
//     const sz = box.getSize(new THREE.Vector3());
//     const ctr = box.getCenter(new THREE.Vector3());
//     const s = TARGET_WIDTH / Math.max(sz.x, sz.z);
//     model.scale.multiplyScalar(s);
//     model.position.set(-ctr.x * s, -ctr.y * s, -ctr.z * s);
//     rig.floorY = (-sz.y * s) / 2;

//     return rig;
//   }, [gltf, poster]);

//   useEffect(() => {
//     if (!DEBUG) return;
//     const onKey = (e: KeyboardEvent) => {
//       const k = e.key.toLowerCase();
//       if (k !== "v" && k !== "h") return;
//       if (k === "v") rig.userFlipV = !rig.userFlipV;
//       else rig.userFlipU = !rig.userFlipU;
//       const img = poster.image as { width: number; height: number };
//       rig.place(poster, img.width / img.height);
//       rig.fitted = false;
//       console.log(`[MacbookShowcase] paste in config -> const FLIP_V = ${rig.userFlipV}; const FLIP_H = ${rig.userFlipU};`);
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [rig, poster]);

//   // Click on the screen: play / pause (or pick the screen mesh in DEBUG)
//   const onScreenClick = (e: ThreeEvent<MouseEvent>) => {
//     const mesh = e.object as THREE.Mesh;
//     if (DEBUG && mesh.isMesh) {
//       e.stopPropagation();
//       rig.assign(mesh);
//       console.log(`[MacbookShowcase] screen set. Paste in config -> const SCREEN_MESH = "${mesh.name}";`);
//     }
//     if (video) {
//       if (video.paused) video.play().catch(() => {});
//       else if (!DEBUG) video.pause();
//     }
//   };

//   useFrame((_, dt) => {
//     const g = group.current;
//     if (!g) return;

//     const target = reduce ? 0.66 : progress.get();
//     smooth.current = THREE.MathUtils.damp(smooth.current, target, 7, dt);
//     const p = smooth.current;

//     const ss = (r: [number, number]) => THREE.MathUtils.smoothstep(p, r[0], r[1]);
//     const spin = ss(T_SPIN);
//     const open = ss(T_OPEN);
//     const dolly = ss(T_DOLLY);
//     const titleGone = reduce ? 0 : ss(T_TITLE_FADE);
//     const lerp = THREE.MathUtils.lerp;

//     // title: driven by the SAME smoothed progress as the camera, so they can never disagree
//     const h = headRef.current;
//     if (h) {
//       const t = 1 - titleGone;
//       h.style.opacity = String(t);
//       h.style.transform = `translateY(${-40 * (1 - t)}px)`;
//       h.style.visibility = t < 0.01 ? "hidden" : "visible";
//     }

//     g.rotation.y = MODEL_YAW + (1 - spin) * START_YAW;
//     if (rig.lid) rig.lid.rotation[LID_AXIS] = rig.restRot + (1 - open) * LID_CLOSE_DELTA;

//     const aspect = size.width / size.height;
//     const fov = THREE.MathUtils.degToRad(camera.fov);
//     const near = (TARGET_WIDTH * END_FILL) / (2 * Math.tan(fov / 2) * Math.min(aspect, 1.8));
//     const far = near * FAR_MULT;
//     camera.position.y = lerp(CAM_Y_START, CAM_Y_END, dolly);
//     camera.position.z = lerp(far, near, dolly);

//     // keep the laptop below the title, then recenter as the title goes away
//     camera.setViewOffset(size.width, size.height, 0, -shiftRef.current * (1 - titleGone), size.width, size.height);
//     camera.lookAt(0, lerp(0, SCREEN_Y, dolly), 0);

//     if (!rig.mat) return;

//     const useVideo = !!video && !!videoTex && !video.error;
//     if (useVideo && video && videoTex) {
//       if (!rig.fitted && video.readyState >= 1 && video.videoHeight) {
//         rig.place(videoTex, video.videoWidth / video.videoHeight);
//         rig.fitted = true;
//       }
//       if (!rig.firstFrame && video.readyState >= 2) {
//         videoTex.needsUpdate = true;
//         rig.firstFrame = true;
//       }
//       if (active && open > 0.97 && video.paused && !rig.tried) {
//         rig.tried = true;
//         video.play().then(() => onNeedTap(false)).catch(() => onNeedTap(true));
//       }
//       if (open < 0.8) {
//         rig.tried = false;
//         if (!video.paused) video.pause();
//         onNeedTap(false);
//       }
//       rig.mat.map = videoTex; // video only, never the poster
//     } else {
//       rig.mat.map = poster; // fallback
//     }
//   });

//   return (
//     <>
//       <group ref={group}>
//         <primitive object={rig.model} onClick={onScreenClick} />
//       </group>
//       <ContactShadows position={[0, rig.floorY, 0]} opacity={0.55} scale={14} blur={2.6} far={4} />
//     </>
//   );
// }

// useGLTF.preload(MODEL_SRC);

// /* ─────────────────────────── Section wrapper ─────────────────────────── */

// export function MacbookShowcase() {
//   const reduce = !!useReducedMotion();
//   const outer = useRef<HTMLDivElement>(null);
//   const headRef = useRef<HTMLDivElement>(null);
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const shiftRef = useRef(0);
//   const inView = useInView(outer, { margin: "300px 0px" });
//   const [needTap, setNeedTap] = useState(false);

//   const { scrollYProgress } = useScroll({
//     target: outer,
//     offset: [`start ${NAV_H}px`, "end end"],
//   });

//   // measure the title so the laptop is framed below it
//   useLayoutEffect(() => {
//     const el = headRef.current;
//     if (!el) return;
//     const measure = () => {
//       shiftRef.current = (el.offsetTop + el.offsetHeight + 12) / 2;
//     };
//     measure();
//     const ro = new ResizeObserver(measure);
//     ro.observe(el);
//     return () => ro.disconnect();
//   }, []);

//   return (
//     <section
//       ref={outer}
//       className={`relative bg-[#050d1f] text-white ${reduce ? "" : SCROLL_LENGTH}`}
//       style={reduce ? { height: `calc(100svh - ${NAV_H}px)` } : undefined}
//     >
//       <div className="sticky overflow-hidden" style={{ top: NAV_H, height: `calc(100svh - ${NAV_H}px)` }}>
//         <div
//           aria-hidden
//           className="pointer-events-none absolute left-1/2 top-1/2 h-[620px] w-[min(1100px,120%)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1d4ed8]/30 blur-[140px]"
//         />

//         <div
//           ref={headRef}
//           className="pointer-events-none absolute inset-x-0 z-10 mx-auto max-w-[900px] px-6 text-center"
//           style={{ top: 28 }}
//         >
//           {/* inline sizes: a global h2/p rule in the site CSS overrides utility classes */}
//           <h2
//             className="font-display font-extrabold"
//             style={{ fontSize: "clamp(28px, 4.2vw, 54px)", lineHeight: 1.08, letterSpacing: "-0.03em", margin: 0 }}
//           >
//             See the difference precision makes.
//           </h2>
//           <p
//             className="text-white/60"
//             style={{ fontSize: "clamp(14px, 1.4vw, 18px)", lineHeight: 1.5, margin: "12px 0 0" }}
//           >
//             Give your team a focused view of the prospects worth pursuing.
//           </p>
//         </div>

//         <div
//           role="img"
//           aria-label="MacBook opening to show the MetaMaster prospect list"
//           className="absolute inset-0"
//         >
//           <Canvas
//             dpr={[1, 2]}
//             frameloop={inView ? "always" : "never"}
//             camera={{ fov: 35, position: [0, CAM_Y_START, 10] }}
//             gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
//           >
//             <ambientLight intensity={0.4} />
//             <Suspense fallback={null}>
//               <Environment preset="studio" />
//               <Laptop
//                 progress={scrollYProgress}
//                 reduce={reduce}
//                 active={inView}
//                 headRef={headRef}
//                 shiftRef={shiftRef}
//                 videoRef={videoRef}
//                 onNeedTap={setNeedTap}
//               />
//             </Suspense>
//           </Canvas>
//         </div>

//         {/* Shown only when the browser blocks autoplay */}
//         {needTap && (
//           <div className="absolute inset-0 z-20 flex items-center justify-center">
//             <button
//               type="button"
//               aria-label="Play video"
//               onClick={() => {
//                 videoRef.current?.play().catch(() => {});
//                 setNeedTap(false);
//               }}
//               className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-white shadow-[0_8px_40px_rgba(0,0,0,0.5)] ring-1 ring-white/40 backdrop-blur-md transition hover:scale-105 hover:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
//             >
//               <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8" fill="currentColor" aria-hidden>
//                 <path d="M8 5v14l11-7z" />
//               </svg>
//             </button>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }








"use client";

/**
 * Scroll-driven MacBook (desktop) / static MacBook with playing video (mobile).
 *
 * npm i three @react-three/fiber @react-three/drei framer-motion
 * npm i -D @types/three
 *
 * /public: macbook.glb, demo.mp4, poster-light.png, poster-dark.png
 *
 * DESKTOP (md and up, >= 768px): unchanged. Pinned scroll animation.
 * MOBILE (< 768px): no pinned scroll, no animation. The laptop stands still in
 * its final open pose and the video plays on the screen. Set MOBILE_MODE to
 * "video" to skip 3D on phones and show just the video.
 */

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Environment, useGLTF, useTexture } from "@react-three/drei";
import { useInView, useReducedMotion, useScroll, type MotionValue } from "framer-motion";

/* ───────────────────────── CONFIG (tweak here) ───────────────────────── */
const CDN = process.env.NEXT_PUBLIC_CDN_URL;


const MODEL_SRC = `${CDN}/video/model/macbook-3.glb`;
const POSTER_LIGHT = `${CDN}/images/poster-light.png`;
const POSTER_DARK = `${CDN}/images/poster-dark.png`;
const VIDEO_SRC = `${CDN}/video/demo.mp4`;
const HAS_VIDEO = true;

const MOBILE_MODE: "3d" | "video" = "3d"; // "3d" = still laptop + video, "video" = video only
const MOBILE_FILL = 1.08; // mobile laptop size: smaller number = bigger laptop
const MOBILE_QUERY = "(max-width: 767px)"; // same as Tailwind's below-md

const DEBUG = false;

const LID_NODE: string | null = null;
const SCREEN_MESH: string | null = null;

const FLIP_V = false;
const FLIP_H = false;

const LID_AXIS: "x" | "y" | "z" = "x";
const LID_CLOSE_DELTA = -1.75;
const START_YAW = -2.4;
const MODEL_YAW = 0;
const TARGET_WIDTH = 4;
const SCREEN_Y = 0.5;
const CAM_Y_START = 2.6;
const CAM_Y_END = 0.45;
const FAR_MULT = 1.7;
const END_FILL = 1.0;

// Desktop timeline (0..1) of the pinned stage
const T_SPIN: [number, number] = [0, 0.4];
const T_OPEN: [number, number] = [0.3, 0.68];
const T_DOLLY: [number, number] = [0.62, 1];
const T_TITLE_FADE: [number, number] = [0.4, 0.58];

// Desktop navbar height. Keep in sync with the md:top-[58px] / 58px classes below.
const NAV_H = 58;

/* ───────────────────────────── helpers ───────────────────────────── */

function localAspect(geo: THREE.BufferGeometry) {
  geo.computeBoundingBox();
  const d = geo.boundingBox!.getSize(new THREE.Vector3()).toArray().sort((a, b) => b - a);
  return d[0] / Math.max(d[1], 1e-6);
}

function uvSpan(geo: THREE.BufferGeometry) {
  const uv = geo.attributes.uv;
  if (!uv) return 0;
  let u0 = Infinity, u1 = -Infinity, v0 = Infinity, v1 = -Infinity;
  for (let i = 0; i < uv.count; i++) {
    const u = uv.getX(i), v = uv.getY(i);
    if (u < u0) u0 = u;
    if (u > u1) u1 = u;
    if (v < v0) v0 = v;
    if (v > v1) v1 = v;
  }
  return Math.min(u1 - u0, v1 - v0);
}

const matOf = (m: THREE.Mesh) =>
  (Array.isArray(m.material) ? m.material[0] : m.material) as THREE.MeshStandardMaterial;

type Rig = {
  model: THREE.Object3D;
  lid?: THREE.Object3D;
  mat?: THREE.MeshBasicMaterial;
  restRot: number;
  floorY: number;
  screenAspect: number;
  autoFlipU: boolean;
  autoFlipV: boolean;
  userFlipU: boolean;
  userFlipV: boolean;
  fitted: boolean;
  firstFrame: boolean;
  tried: boolean;
  assign: (mesh: THREE.Mesh) => void;
  place: (tex: THREE.Texture, imgAspect: number) => void;
};

function PlayButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center">
      <button
        type="button"
        aria-label="Play video"
        onClick={onClick}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white shadow-[0_8px_40px_rgba(0,0,0,0.5)] ring-1 ring-white/40 backdrop-blur-md transition hover:scale-105 hover:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:h-20 md:w-20"
      >
        <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 md:h-8 md:w-8" fill="currentColor" aria-hidden>
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>
    </div>
  );
}

/* ───────────────────────────── 3D scene ───────────────────────────── */

function Laptop({
  progress,
  reduce,
  mobile,
  active,
  headRef,
  shiftRef,
  videoRef,
  onNeedTap,
}: {
  progress: MotionValue<number>;
  reduce: boolean;
  mobile: boolean;
  active: boolean;
  headRef: React.RefObject<HTMLDivElement | null>;
  shiftRef: React.MutableRefObject<number>;
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
  onNeedTap: (v: boolean) => void;
}) {
  const gltf = useGLTF(MODEL_SRC);
  const isDark = useMemo(() => document.documentElement.classList.contains("dark"), []);
  const poster = useTexture(isDark ? POSTER_DARK : POSTER_LIGHT);
  const group = useRef<THREE.Group>(null);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  // one smoothed progress drives everything. On mobile it starts at the final pose.
  const smooth = useRef(mobile ? 1 : reduce ? 0.66 : 0);

  const video = useMemo(() => {
    if (!HAS_VIDEO || reduce) return null;
    const v = document.createElement("video");
    v.src = VIDEO_SRC;
    v.crossOrigin = "anonymous";
    v.loop = true;
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    v.setAttribute("playsinline", "");
    v.preload = "auto";
    return v;
  }, [reduce]);

  const videoTex = useMemo(() => {
    if (!video) return null;
    const t = new THREE.VideoTexture(video);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [video]);

  useEffect(() => {
    videoRef.current = video;
    if (!video) return;
    const playing = () => onNeedTap(false);
    video.addEventListener("playing", playing);
    return () => video.removeEventListener("playing", playing);
  }, [video, videoRef, onNeedTap]);

  useEffect(() => {
    if (!active && video && !video.paused) video.pause();
  }, [active, video]);

  const rig = useMemo<Rig>(() => {
    const model = gltf.scene.clone(true);
    model.updateMatrixWorld(true);

    const rig: Rig = {
      model,
      restRot: 0,
      floorY: 0,
      screenAspect: 1.6,
      autoFlipU: false,
      autoFlipV: false,
      userFlipU: FLIP_H,
      userFlipV: FLIP_V,
      fitted: false,
      firstFrame: false,
      tried: false,
      assign: () => {},
      place: () => {},
    };

    rig.place = (tex, imgAspect) => {
      tex.flipY = false;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.repeat.set(1, 1);
      tex.offset.set(0, 0);
      if (imgAspect > rig.screenAspect) {
        const r = rig.screenAspect / imgAspect;
        tex.repeat.x = r;
        tex.offset.x = (1 - r) / 2;
      } else {
        const r = imgAspect / rig.screenAspect;
        tex.repeat.y = r;
        tex.offset.y = (1 - r) / 2;
      }
      if (rig.autoFlipV !== rig.userFlipV) {
        tex.offset.y += tex.repeat.y;
        tex.repeat.y *= -1;
      }
      if (rig.autoFlipU !== rig.userFlipU) {
        tex.offset.x += tex.repeat.x;
        tex.repeat.x *= -1;
      }
      tex.needsUpdate = true;
    };

    rig.assign = (mesh) => {
      const geo = mesh.geometry.clone();
      mesh.geometry = geo;
      mesh.updateWorldMatrix(true, false);

      const pos = geo.attributes.position;
      const p = new THREE.Vector3();
      const xs: number[] = [];
      const ys: number[] = [];
      for (let i = 0; i < pos.count; i++) {
        p.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
        xs.push(p.x);
        ys.push(p.y);
      }
      const x0 = Math.min(...xs), x1 = Math.max(...xs);
      const y0 = Math.min(...ys), y1 = Math.max(...ys);

      if (uvSpan(geo) <= 0.9) {
        const uv = new Float32Array(pos.count * 2);
        for (let i = 0; i < pos.count; i++) {
          uv[i * 2] = (xs[i] - x0) / Math.max(x1 - x0, 1e-6);
          uv[i * 2 + 1] = 1 - (ys[i] - y0) / Math.max(y1 - y0, 1e-6);
        }
        geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
      }

      const uvA = geo.attributes.uv;
      let um = 0, vm = 0;
      for (let i = 0; i < uvA.count; i++) {
        um += uvA.getX(i);
        vm += uvA.getY(i);
      }
      um /= uvA.count;
      vm /= uvA.count;
      const xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
      let covU = 0, covV = 0;
      for (let i = 0; i < uvA.count; i++) {
        covU += (uvA.getX(i) - um) * (xs[i] - xm);
        covV += (uvA.getY(i) - vm) * (ys[i] - ym);
      }
      rig.autoFlipU = covU < 0;
      rig.autoFlipV = covV > 0;

      rig.screenAspect = localAspect(geo);
      const img = poster.image as { width: number; height: number };
      rig.place(poster, img.width / img.height);

      rig.mat?.dispose();
      rig.mat = new THREE.MeshBasicMaterial({ map: poster, toneMapped: false, side: THREE.DoubleSide });
      mesh.material = rig.mat;
      rig.fitted = false;
      rig.firstFrame = false;
    };

    let lid: THREE.Object3D | undefined;
    const lines: string[] = [];
    const cands: { mesh: THREE.Mesh; score: number; area: number; aspect: number }[] = [];
    const v3 = new THREE.Vector3();

    model.traverse((o) => {
      if (DEBUG) {
        let d = 0;
        for (let q = o.parent; q; q = q.parent) d++;
        lines.push(`${"  ".repeat(d)}${o.type}: "${o.name}"`);
      }
      if (!lid && (LID_NODE ? o.name === LID_NODE : /lid|display|screen/i.test(o.name))) lid = o;

      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const mt = matOf(m);
      m.geometry.computeBoundingBox();
      const dims = m.geometry.boundingBox!.getSize(v3).toArray().sort((a, b) => b - a);
      const flat = dims[2] / Math.max(dims[0], 1e-6);
      const aspect = dims[0] / Math.max(dims[1], 1e-6);
      const named = SCREEN_MESH
        ? o.name === SCREEN_MESH
        : /screen|display|lcd|monitor|wallpaper|glass|panel/i.test(`${o.name} ${mt?.name ?? ""}`);
      const hasMap = !!(mt?.map || mt?.emissiveMap);
      const c = mt?.color;
      const dark = !!c && c.r * 0.2126 + c.g * 0.7152 + c.b * 0.0722 < 0.05;
      const score =
        (named ? 10 : 0) + (hasMap ? 3 : 0) + (dark ? 3 : 0) + (flat < 0.06 ? 2 : 0) + (aspect > 1.3 && aspect < 1.9 ? 2 : 0);
      cands.push({ mesh: m, score, area: dims[0] * dims[1], aspect });
    });

    cands.sort(
      (a, b) => b.score - a.score || Math.abs(a.aspect - 1.6) - Math.abs(b.aspect - 1.6) || b.area - a.area
    );

    // 1) explicit name  2) what you would click: a ray at the lid's center  3) best score
    let screen: THREE.Mesh | undefined;
    let how = "";
    if (SCREEN_MESH) {
      screen = cands.find((c) => c.mesh.name === SCREEN_MESH)?.mesh;
      how = "SCREEN_MESH";
    }
    if (!screen) {
      const box = lid ? new THREE.Box3().setFromObject(lid) : new THREE.Box3().setFromObject(model);
      const c = box.getCenter(new THREE.Vector3());
      if (!lid) c.y = box.min.y + (box.max.y - box.min.y) * 0.7;
      const rc = new THREE.Raycaster(new THREE.Vector3(c.x, c.y, box.max.z + 10), new THREE.Vector3(0, 0, -1));
      const hit = rc.intersectObject(model, true).find((h) => (h.object as THREE.Mesh).isMesh);
      if (hit) {
        screen = hit.object as THREE.Mesh;
        how = "ray at lid center";
      }
    }
    if (!screen && cands[0] && cands[0].score >= 5) {
      screen = cands[0].mesh;
      how = "best score";
    }

    if (DEBUG) {
      console.log("[MacbookShowcase] node tree:\n" + lines.join("\n"));
      console.log("[MacbookShowcase] lid:", lid?.name, "| screen:", screen?.name ?? "NOT FOUND", `(${how})`);
    }

    rig.lid = lid;
    rig.restRot = lid ? lid.rotation[LID_AXIS] : 0;
    if (screen) rig.assign(screen);

    const box = new THREE.Box3().setFromObject(model);
    const sz = box.getSize(new THREE.Vector3());
    const ctr = box.getCenter(new THREE.Vector3());
    const s = TARGET_WIDTH / Math.max(sz.x, sz.z);
    model.scale.multiplyScalar(s);
    model.position.set(-ctr.x * s, -ctr.y * s, -ctr.z * s);
    rig.floorY = (-sz.y * s) / 2;

    return rig;
  }, [gltf, poster]);

  useEffect(() => {
    if (!DEBUG) return;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k !== "v" && k !== "h") return;
      if (k === "v") rig.userFlipV = !rig.userFlipV;
      else rig.userFlipU = !rig.userFlipU;
      const img = poster.image as { width: number; height: number };
      rig.place(poster, img.width / img.height);
      rig.fitted = false;
      console.log(`[MacbookShowcase] paste in config -> const FLIP_V = ${rig.userFlipV}; const FLIP_H = ${rig.userFlipU};`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [rig, poster]);

  const onScreenClick = (e: ThreeEvent<MouseEvent>) => {
    const mesh = e.object as THREE.Mesh;
    if (DEBUG && mesh.isMesh) {
      e.stopPropagation();
      rig.assign(mesh);
      console.log(`[MacbookShowcase] screen set. Paste in config -> const SCREEN_MESH = "${mesh.name}";`);
    }
    if (video) {
      if (video.paused) video.play().catch(() => {});
      else if (!DEBUG) video.pause();
    }
  };

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;

    const target = mobile ? 1 : reduce ? 0.66 : progress.get();
    smooth.current = THREE.MathUtils.damp(smooth.current, target, 7, dt);
    const p = smooth.current;

    const ss = (r: [number, number]) => THREE.MathUtils.smoothstep(p, r[0], r[1]);
    const spin = ss(T_SPIN);
    const open = ss(T_OPEN);
    const dolly = ss(T_DOLLY);
    const titleGone = reduce || mobile ? 0 : ss(T_TITLE_FADE);
    const lerp = THREE.MathUtils.lerp;

    // title fade is desktop-only (on mobile the title is normal content above the laptop)
    const h = headRef.current;
    if (h) {
      if (mobile) {
        if (h.style.opacity) {
          h.style.opacity = "";
          h.style.transform = "";
          h.style.visibility = "";
        }
      } else {
        const t = 1 - titleGone;
        h.style.opacity = String(t);
        h.style.transform = `translateY(${-40 * (1 - t)}px)`;
        h.style.visibility = t < 0.01 ? "hidden" : "visible";
      }
    }

    g.rotation.y = MODEL_YAW + (1 - spin) * START_YAW;
    if (rig.lid) rig.lid.rotation[LID_AXIS] = rig.restRot + (1 - open) * LID_CLOSE_DELTA;

    const aspect = size.width / size.height;
    const fov = THREE.MathUtils.degToRad(camera.fov);

    if (mobile) {
      // fixed final pose: whole laptop fits the width, no scroll movement
      const dist = (TARGET_WIDTH * MOBILE_FILL) / (2 * Math.tan(fov / 2) * aspect);
      camera.position.set(0, CAM_Y_END, dist);
      if (camera.view) camera.clearViewOffset();
      camera.lookAt(0, SCREEN_Y, 0);
    } else {
      const near = (TARGET_WIDTH * END_FILL) / (2 * Math.tan(fov / 2) * Math.min(aspect, 1.8));
      const far = near * FAR_MULT;
      camera.position.y = lerp(CAM_Y_START, CAM_Y_END, dolly);
      camera.position.z = lerp(far, near, dolly);
      camera.setViewOffset(size.width, size.height, 0, -shiftRef.current * (1 - titleGone), size.width, size.height);
      camera.lookAt(0, lerp(0, SCREEN_Y, dolly), 0);
    }

    if (!rig.mat) return;

    const useVideo = !!video && !!videoTex && !video.error;
    if (useVideo && video && videoTex) {
      if (!rig.fitted && video.readyState >= 1 && video.videoHeight) {
        rig.place(videoTex, video.videoWidth / video.videoHeight);
        rig.fitted = true;
      }
      if (!rig.firstFrame && video.readyState >= 2) {
        videoTex.needsUpdate = true;
        rig.firstFrame = true;
      }
      if (active && open > 0.97 && video.paused && !rig.tried) {
        rig.tried = true;
        video.play().then(() => onNeedTap(false)).catch(() => onNeedTap(true));
      }
      if (open < 0.8) {
        rig.tried = false;
        if (!video.paused) video.pause();
        onNeedTap(false);
      }
      rig.mat.map = videoTex;
    } else {
      rig.mat.map = poster;
    }
  });

  useGLTF.preload(MODEL_SRC);

  return (
    <>
      <group ref={group}>
        <primitive object={rig.model} onClick={onScreenClick} />
      </group>
      <ContactShadows position={[0, rig.floorY, 0]} opacity={0.55} scale={14} blur={2.6} far={4} />
    </>
  );
}

/* ───────────────────── Mobile "video only" option ───────────────────── */

function MobileVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [needTap, setNeedTap] = useState(false);

  useEffect(() => {
    ref.current?.play().catch(() => setNeedTap(true));
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <div className="relative mx-auto w-full max-w-[560px] px-4">
      <div className="relative overflow-hidden rounded-2xl shadow-[0_30px_80px_-30px_rgba(29,78,216,0.6)] ring-1 ring-white/10">
        {HAS_VIDEO ? (
          <video
            ref={ref}
            src={VIDEO_SRC}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            onClick={toggle}
            onPlaying={() => setNeedTap(false)}
            className="block aspect-[16/10] w-full object-cover"
          />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={POSTER_LIGHT} alt="" className="block aspect-[16/10] w-full object-cover dark:hidden" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={POSTER_DARK} alt="" className="hidden aspect-[16/10] w-full object-cover dark:block" />
          </>
        )}
        {needTap && <PlayButton onClick={() => ref.current?.play().catch(() => {}).then(() => setNeedTap(false))} />}
      </div>
    </div>
  );
}

/* ─────────────────────────── Section wrapper ─────────────────────────── */

export function MacbookShowcase() {
  const reduce = !!useReducedMotion();
  const outer = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const shiftRef = useRef(0);
  const inView = useInView(outer, { margin: "300px 0px" });
  const [needTap, setNeedTap] = useState(false);
  const [mode, setMode] = useState<"mobile" | "desktop" | null>(null); // null until we know (no wrong first frame)

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => setMode(mq.matches ? "mobile" : "desktop");
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: outer,
    offset: [`start ${NAV_H}px`, "end end"],
  });

  useLayoutEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const measure = () => {
      shiftRef.current = (el.offsetTop + el.offsetHeight + 12) / 2;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const mobile = mode === "mobile";

  return (
    <section
      ref={outer}
      // mobile: normal height. desktop: tall track for the pinned scroll animation
      className={`relative bg-[#050d1f] text-white ${
        reduce ? "md:h-[calc(100svh-58px)]" : "md:h-[360vh]"
      }`}
    >
      <div className="relative overflow-hidden pb-8 md:sticky md:top-[58px] md:h-[calc(100svh-58px)] md:pb-0">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[62%] h-[360px] w-[min(1100px,120%)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1d4ed8]/30 blur-[120px] md:top-1/2 md:h-[620px] md:blur-[140px]"
        />

        <div
          ref={headRef}
          className="pointer-events-none relative z-10 mx-auto max-w-[900px] px-6 pb-4 pt-10 text-center md:absolute md:inset-x-0 md:top-7 md:pb-0 md:pt-0"
        >
          {/* inline sizes: a global h2/p rule in the site CSS overrides utility classes */}
          <h2
            className="font-display font-extrabold"
            style={{ fontSize: "clamp(28px, 4.2vw, 54px)", lineHeight: 1.08, letterSpacing: "-0.03em", margin: 0 }}
          >
            See the difference precision makes.
          </h2>
          <p
            className="text-white/60"
            style={{ fontSize: "clamp(14px, 1.4vw, 18px)", lineHeight: 1.5, margin: "12px 0 0" }}
          >
            Give your team a focused view of the prospects worth pursuing.
          </p>
        </div>

        {mobile && MOBILE_MODE === "video" ? (
          <MobileVideo />
        ) : (
          <div
            role="img"
            aria-label="MacBook showing the MetaMaster prospect list"
            className="relative h-[72vw] max-h-[460px] min-h-[280px] md:absolute md:inset-0 md:h-auto md:max-h-none md:min-h-0"
          >
            {mode && (
              <Canvas
                dpr={mobile ? [1, 1.5] : [1, 2]}
                frameloop={inView ? "always" : "never"}
                camera={{ fov: 35, position: [0, CAM_Y_START, 10] }}
                gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
                // keep vertical page scrolling working when a finger starts on the laptop
                onCreated={({ gl }) => {
                  gl.domElement.style.touchAction = "pan-y";
                }}
              >
                <ambientLight intensity={0.4} />
                <Suspense fallback={null}>
                  <Environment preset="studio" />
                  <Laptop
                    progress={scrollYProgress}
                    reduce={reduce}
                    mobile={mobile}
                    active={inView}
                    headRef={headRef}
                    shiftRef={shiftRef}
                    videoRef={videoRef}
                    onNeedTap={setNeedTap}
                  />
                </Suspense>
              </Canvas>
            )}
            {needTap && (
              <PlayButton
                onClick={() => {
                  videoRef.current?.play().catch(() => {});
                  setNeedTap(false);
                }}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}