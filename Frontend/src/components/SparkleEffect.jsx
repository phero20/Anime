import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const SparkleEffect = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(
    () => ({
      background: { color: { value: "transparent" } },
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: { enable: true, mode: "push" },
          onHover: { enable: false },
          resize: true
        },
        modes: {
          push: { quantity: 3 } // Number of particles created on click
        }
      },
      particles: {
        number: { value: 0 }, // No particles on start
        color: { value: ["#F47521", "#F47515", "#F47530", "#F47540"] },
        shape: { type: "star" },
        opacity: {
          value: { min: 0.6, max: 1 },
          animation: { enable: true, speed: 1, startValue: "max", destroy: "min" }
        },
        size: {
          value: { min: 1, max: 3 },
          animation: { enable: true, speed: 5, startValue: "max", destroy: "min" }
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          random: true,
          outModes: { default: "destroy" },
          straight: false
        },
        links: { enable: false }
      },
      detectRetina: true
    }),
    []
  );

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      options={options}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 99
      }}
    />
  );
};

export default SparkleEffect;
