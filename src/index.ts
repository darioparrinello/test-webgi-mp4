import {
  ViewerApp,
  AssetManagerPlugin,
  GBufferPlugin,
  ProgressivePlugin,
  TonemapPlugin,
  SSRPlugin,
  SSAOPlugin,
  BloomPlugin,
  TemporalAAPlugin,
  Vector3,
  GammaCorrectionPlugin,
  MeshBasicMaterial2,
  Color,
} from "webgi";

import "./styles.css";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

async function setupViewer() {
  const viewer = new ViewerApp({
    canvas: document.getElementById("webgi-canvas") as HTMLCanvasElement,
    // isAntialiased: true,
  });

  const manager = await viewer.addPlugin(AssetManagerPlugin);
  const camera = viewer.scene.activeCamera;
  const position = camera.position;
  const target = camera.target;
  const exitButton = document.querySelector(".button--exit") as HTMLElement;
  const customizerInterface = document.querySelector(
    ".customizer--container"
  ) as HTMLElement;

  // Add plugins individually.
  await viewer.addPlugin(GBufferPlugin);
  await viewer.addPlugin(new ProgressivePlugin(32));
  await viewer.addPlugin(new TonemapPlugin(true));
  await viewer.addPlugin(GammaCorrectionPlugin);
  await viewer.addPlugin(SSRPlugin);
  await viewer.addPlugin(SSAOPlugin);
  await viewer.addPlugin(BloomPlugin);
  await viewer.addPlugin(TemporalAAPlugin);

  viewer.renderer.refreshPipeline();

  await manager.addFromPath("./assets/mp4.glb");

  const drillMaterial = manager.materials!.findMaterialsByName(
    "Drill_01"
  )[0] as MeshBasicMaterial2;

  viewer.getPlugin(TonemapPlugin)!.config!.clipBackground = true; // in case its set to false in the glb

  viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false });

  onUpdate();

  function setupScrollanimation() {
    const tl = gsap.timeline();

    // FIRST SECTION

    tl.to(position, {
      x: 0.61,
      y: 0.12,
      z: -3.04,
      scrollTrigger: {
        trigger: ".second",
        start: "top bottom",
        end: "+=100%",
        scrub: true,
        immediateRender: false,
        markers: false,
      },
      onUpdate,
    })

      .to(".section--one--container", {
        xPercent: "-150",
        opacity: 0,
        scrollTrigger: {
          trigger: ".second",
          start: "top bottom",
          end: "+=100%",
          scrub: true,
          immediateRender: false,
        },
      })
      .to(target, {
        x: -0.67,
        y: -0.21,
        z: 0.09,
        scrollTrigger: {
          trigger: ".second",
          start: "top bottom",
          end: "+=100%",
          scrub: true,
          immediateRender: false,
        },
      });

    // SECOND SECTION

    tl.to(position, {
      x: 3.1,
      y: 4.82,
      z: -3.6,
      scrollTrigger: {
        trigger: ".third",
        start: "top bottom",
        end: "+=100%",
        scrub: true,
        immediateRender: false,
        markers: false,
      },
      onUpdate,
    })

      // .to(".section--third--container", {
      //   xPercent: "-150",
      //   opacity: 0,
      //   scrollTrigger: {
      //     trigger: ".third",
      //     start: "top bottom",
      //     end: "+=100%",
      //     scrub: true,
      //     immediateRender: false,
      //   },
      // })
      .to(target, {
        x: 0.71,
        y: -0.7,
        z: 0.5,
        scrollTrigger: {
          trigger: ".third",
          start: "top bottom",
          end: "+=100%",
          scrub: true,
          immediateRender: false,
        },
      })

      // LAST SECTION

      .to(position, {
        x: 2.03,
        y: 0.31,
        z: 3.9,
        scrollTrigger: {
          trigger: ".fourth",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
        },
        onUpdate,
      })

      .to(target, {
        x: 0.25,
        y: 0.12,
        z: 0.26,
        scrollTrigger: {
          trigger: ".fourth",
          start: "top bottom",
          end: "+=100%",
          scrub: true,
          immediateRender: false,
        },
      });
  }

  setupScrollanimation();

  // WEBGI UPDATE
  let needsUpdate = true;

  function onUpdate() {
    needsUpdate = true;
    // viewer.renderer.resetShadows()
    viewer.setDirty();
  }

  viewer.addEventListener("preFrame", () => {
    if (needsUpdate) {
      camera.positionTargetUpdated(true);
      needsUpdate = false;
    }
  });

  // KNOW MORE EVENT
  document.querySelector(".button--hero")?.addEventListener("click", () => {
    const element = document.querySelector(".second");
    window.scrollTo({
      top: element?.getBoundingClientRect().top,
      left: 0,
      behavior: "smooth",
    });
  });

  // KNOW MORE EVENT 2
  document.querySelector(".button--second")?.addEventListener("click", () => {
    const element_2 = document.querySelector(".third");
    window.scrollTo({
      top: element_2?.getBoundingClientRect().bottom,
      left: 0,
      behavior: "smooth",
    });
  });

  // KNOW MORE EVENT 3
  document.querySelector(".button--third")?.addEventListener("click", () => {
    const element_3 = document.querySelector(".fourth");
    window.scrollTo({
      top: element_3?.getBoundingClientRect().bottom,
      left: 0,
      behavior: "smooth",
    });
    console.log("click");
  });

  // SCROLL TO TOP
  document.querySelectorAll(".button--footer")?.forEach((item) => {
    item.addEventListener("click", () => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    });
  });

  // CUSTOMIZE
  const sections = document.querySelector(".container") as HTMLElement;
  const mainContainer = document.getElementById(
    "webgi-canvas-container"
  ) as HTMLElement;
  document
    .querySelector(".button--customize")
    ?.addEventListener("click", () => {
      sections.style.visibility = "hidden";
      mainContainer.style.pointerEvents = "all";
      document.body.style.cursor = "grab";

      gsap.to(position, {
        x: 3,
        y: 1.7,
        z: -3.9,
        duration: 2,
        ease: "power3.inOut",
        onUpdate,
      });
      gsap.to(target, {
        x: -0.08,
        y: -0.32,
        z: -0.15,
        duration: 2,
        ease: "power3.inOut",
        onUpdate,
        onComplete: enableControlers,
      });
    });

  function enableControlers() {
    exitButton.style.visibility = "visible";
    customizerInterface.style.visibility = "false";
    viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: true });
  }

  // EXIT CUSTOMIZER
  exitButton.addEventListener("click", () => {
    gsap.to(position, {
      x: 2.03,
      y: 0.31,
      z: 3.9,
      duration: 1,
      ease: "power3.inOut",
      onUpdate,
    });
    gsap.to(target, {
      x: 0.25,
      y: 0.12,
      z: 0.26,
      duration: 1,
      ease: "power3.inOut",
      onUpdate,
    });

    viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false });
    sections.style.visibility = "visible";
    mainContainer.style.pointerEvents = "none";
    document.body.style.cursor = "default";
    exitButton.style.visibility = "hidden";
    customizerInterface.style.visibility = "hidden";
  });

  document
    .querySelector(".button--colors.black")
    ?.addEventListener("click", () => {
      changeColor(new Color(0x383830).convertSRGBToLinear());
    });

  document
    .querySelector(".button--colors.red")
    ?.addEventListener("click", () => {
      changeColor(new Color(0xfe2d2d).convertSRGBToLinear());
    });

  document
    .querySelector(".button--colors.yellow")
    ?.addEventListener("click", () => {
      changeColor(new Color(0xffffff).convertSRGBToLinear());
    });

  function changeColor(_colorToBeChanged: Color) {
    drillMaterial.color = _colorToBeChanged;
    viewer.scene.setDirty();
  }
}

setupViewer();
