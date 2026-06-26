import React, { useEffect, useRef, useState } from "react";

interface VelvetNoiseProps {
  density?: number;
  driftSpeed?: number;
  breatheSpeed?: number;
  grainSize?: number;
  maxAlpha?: number;
  colorTheme?: "silver" | "gold" | "emerald" | "sunset";
  interactive?: boolean;
}

const permutation = new Uint8Array([
  151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,
  8,99,37,240,21,10,23,190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,
  117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168, 68,175,74,
  165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,
  105,92,41,55,46,245,40,244,102,143,54, 65,180,186,145,21,111,104,118,65,53,
  117,11,250,233,195,62,201,171,30,139,122,95,140,181,25,48,229,19,41,202,152,
  219,118,223,125,230,15,30,135,114,213,246,252,190,83,121,6,209,124,177,180,
  74,88,112,136,131,123,53,197,224,142,61,227,33,185,151,110,4,125,147,172,136,
  77,172,5,18,241,118,20,38,200,55,110,134,166,113,244,242,10,21,128,144,79,
  221,241,12,23,0,111,239,112,68,110,61,125,29,66,69,30,242,192,239,39,178,117,
  9,131,44,26,27,110,90,160,82,59,214,179,41,227,47,132, 5,74,246,144,25,233,
  111,122,98,202,142,201,172,242,88,21,112,6,128,0,111,211,85,110,31,112,50,40
]);

const p = new Uint8Array(512);
for (let i = 0; i < 256; i++) {
  p[i] = permutation[i];
  p[256 + i] = permutation[i];
}

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (t: number, a: number, b: number) => a + t * (b - a);
const grad = (hash: number, x: number, y: number, z: number) => {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
};

const perlinNoise3D = (x: number, y: number, z: number): number => {
  const xFloor = Math.floor(x);
  const yFloor = Math.floor(y);
  const zFloor = Math.floor(z);

  const X = xFloor & 255;
  const Y = yFloor & 255;
  const Z = zFloor & 255;

  const xf = x - xFloor;
  const yf = y - yFloor;
  const zf = z - zFloor;

  const u = fade(xf);
  const v = fade(yf);
  const w = fade(zf);

  const A = p[X] + Y;
  const AA = p[A] + Z;
  const AB = p[A + 1] + Z;
  const B = p[X + 1] + Y;
  const BA = p[B] + Z;
  const BB = p[B + 1] + Z;

  return lerp(w, lerp(v, lerp(u, grad(p[AA], xf, yf, zf),
                                 grad(p[BA], xf - 1, yf, zf)),
                         lerp(u, grad(p[AB], xf, yf - 1, zf),
                                 grad(p[BB], xf - 1, yf - 1, zf))),
                 lerp(v, lerp(u, grad(p[AA + 1], xf, yf, zf - 1),
                                 grad(p[BA + 1], xf - 1, yf, zf - 1)),
                         lerp(u, grad(p[AB + 1], xf, yf - 1, zf - 1),
                                 grad(p[BB + 1], xf - 1, yf - 1, zf - 1))));
};

export default function VelvetNoise({
  density = 2.5,
  driftSpeed = 1.0,
  breatheSpeed = 0.5,
  grainSize = 0.6,
  maxAlpha = 0.95,
  colorTheme = "silver",
  interactive = true,
}: VelvetNoiseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastWidthRef = useRef(typeof window !== "undefined" ? window.innerWidth : 1024);
  const [dimensions, setDimensions] = useState({ width: 1024, height: 768 });

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const w = window.innerWidth;
      const h = window.innerHeight;

      // Ignore height-only changes under 150px — prevents mobile browser chrome show/hide scroll jank
      if (w === lastWidthRef.current && Math.abs(h - dimensions.height) < 150) return;
      lastWidthRef.current = w;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      setDimensions({ width: w, height: h });
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const { width, height } = dimensions;
    const baseRadius = Math.min(width, height) * 0.22;

    const uSteps = Math.floor(Math.sqrt(density) * 125);
    const vSteps = Math.floor(Math.sqrt(density) * 165);
    const totalPoints = uSteps * vSteps;

    const basePoints = new Float32Array(totalPoints * 3);
    let ptIdx = 0;

    for (let u = 0; u < uSteps; u++) {
      const theta = (u / (uSteps - 1)) * Math.PI;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let v = 0; v < vSteps; v++) {
        const phi = (v / vSteps) * Math.PI * 2;
        basePoints[ptIdx++] = sinTheta * Math.cos(phi);
        basePoints[ptIdx++] = sinTheta * Math.sin(phi);
        basePoints[ptIdx++] = cosTheta;
      }
    }

    let animationId: number;
    let globalTime = Math.random() * 500;
    let rotX = 0.05;
    let rotY = 1.25;

    const BUCKET_COUNT = 16;
    const bucketX = Array.from({ length: BUCKET_COUNT }, () => [] as number[]);
    const bucketY = Array.from({ length: BUCKET_COUNT }, () => [] as number[]);
    const bucketS = Array.from({ length: BUCKET_COUNT }, () => [] as number[]);

    const render = () => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      const getLightningPulse = (t: number, period: number, offset: number) => {
        const phase = (t + offset) % period;
        const rise = 0.08;
        const dip = 0.15;
        const peak2 = 0.25;
        const activeEnd = 1.6;

        if (phase < rise) {
          return phase / rise;
        } else if (phase < dip) {
          const f = (phase - rise) / (dip - rise);
          return 1.0 - f * 0.4;
        } else if (phase < peak2) {
          const f = (phase - dip) / (peak2 - dip);
          return 0.6 + f * 0.4;
        } else if (phase < activeEnd) {
          const f = (phase - peak2) / (activeEnd - peak2);
          return Math.pow(1.0 - f, 3.5);
        } else {
          return 0.0;
        }
      };

      const lightning1 = getLightningPulse(globalTime, 6.0, 0.0);
      const t1_x = width * 0.15 + Math.cos(globalTime * 0.04) * 50;
      const t1_y = height * 0.22 + Math.sin(globalTime * 0.05) * 40;
      const r1 = Math.min(width, height) * (0.32 + lightning1 * 0.10);
      const alpha1 = 0.22 * lightning1;

      if (alpha1 > 0.001) {
        try {
          const grad1 = ctx.createRadialGradient(t1_x, t1_y, 0, t1_x, t1_y, r1 > 0 ? r1 : 1);
          grad1.addColorStop(0, `rgba(0, 230, 255, ${alpha1})`);
          grad1.addColorStop(0.5, `rgba(0, 230, 255, ${alpha1 * 0.35})`);
          grad1.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = grad1;
          ctx.fillRect(0, 0, width, height);
        } catch (e) {}
      }

      const lightning2 = getLightningPulse(globalTime, 7.5, 2.0);
      const t2_x = width * 0.85 + Math.sin(globalTime * 0.03) * 60;
      const t2_y = height * 0.45 + Math.cos(globalTime * 0.04) * 50;
      const r2 = Math.min(width, height) * (0.36 + lightning2 * 0.12);
      const alpha2 = 0.25 * lightning2;

      if (alpha2 > 0.001) {
        try {
          const grad2 = ctx.createRadialGradient(t2_x, t2_y, 0, t2_x, t2_y, r2 > 0 ? r2 : 1);
          grad2.addColorStop(0, `rgba(170, 70, 255, ${alpha2})`);
          grad2.addColorStop(0.5, `rgba(170, 70, 255, ${alpha2 * 0.35})`);
          grad2.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = grad2;
          ctx.fillRect(0, 0, width, height);
        } catch (e) {}
      }

      const lightning3 = getLightningPulse(globalTime, 8.5, 4.0);
      const t3_x = width * 0.28 + Math.cos(globalTime * 0.05) * 50;
      const t3_y = height * 0.78 + Math.sin(globalTime * 0.03) * 45;
      const r3 = Math.min(width, height) * (0.35 + lightning3 * 0.11);
      const alpha3 = 0.20 * lightning3;

      if (alpha3 > 0.001) {
        try {
          const grad3 = ctx.createRadialGradient(t3_x, t3_y, 0, t3_x, t3_y, r3 > 0 ? r3 : 1);
          grad3.addColorStop(0, `rgba(255, 80, 210, ${alpha3})`);
          grad3.addColorStop(0.5, `rgba(255, 80, 210, ${alpha3 * 0.35})`);
          grad3.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = grad3;
          ctx.fillRect(0, 0, width, height);
        } catch (e) {}
      }

      const lightning4 = getLightningPulse(globalTime, 9.0, 5.5);
      const t4_x = width * 0.78 + Math.cos(globalTime * 0.04) * 40;
      const t4_y = height * 0.18 + Math.sin(globalTime * 0.05) * 50;
      const r4 = Math.min(width, height) * (0.30 + lightning4 * 0.09);
      const alpha4 = 0.22 * lightning4;

      if (alpha4 > 0.001) {
        try {
          const grad4 = ctx.createRadialGradient(t4_x, t4_y, 0, t4_x, t4_y, r4 > 0 ? r4 : 1);
          grad4.addColorStop(0, `rgba(200, 80, 230, ${alpha4})`);
          grad4.addColorStop(0.5, `rgba(200, 80, 230, ${alpha4 * 0.35})`);
          grad4.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = grad4;
          ctx.fillRect(0, 0, width, height);
        } catch (e) {}
      }

      const fogBanks = [
        {
          color: "0, 230, 255",
          baseX: width * 0.25,
          baseY: height * 0.35,
          scaleX: 1.8,
          scaleY: 0.9,
          radiusFactor: 0.45,
          bAlpha: 0.05,
          lBoost: lightning1 * 0.10,
          driftX: Math.cos(globalTime * 0.02) * 80,
          driftY: Math.sin(globalTime * 0.025) * 50,
          rotation: globalTime * 0.008
        },
        {
          color: "170, 70, 255",
          baseX: width * 0.70,
          baseY: height * 0.50,
          scaleX: 1.6,
          scaleY: 1.1,
          radiusFactor: 0.50,
          bAlpha: 0.06,
          lBoost: lightning2 * 0.12,
          driftX: Math.sin(globalTime * 0.018) * 90,
          driftY: Math.cos(globalTime * 0.022) * 60,
          rotation: -globalTime * 0.006
        },
        {
          color: "255, 80, 210",
          baseX: width * 0.40,
          baseY: height * 0.75,
          scaleX: 2.0,
          scaleY: 0.8,
          radiusFactor: 0.42,
          bAlpha: 0.045,
          lBoost: lightning3 * 0.10,
          driftX: Math.cos(globalTime * 0.015) * 100,
          driftY: Math.sin(globalTime * 0.017) * 45,
          rotation: globalTime * 0.004
        },
        {
          color: "135, 70, 255",
          baseX: width * 0.80,
          baseY: height * 0.20,
          scaleX: 1.5,
          scaleY: 1.0,
          radiusFactor: 0.48,
          bAlpha: 0.05,
          lBoost: lightning4 * 0.11,
          driftX: Math.sin(globalTime * 0.021) * 70,
          driftY: Math.cos(globalTime * 0.016) * 55,
          rotation: -globalTime * 0.007
        },
        {
          color: "180, 80, 240",
          baseX: width * 0.50,
          baseY: height * 0.45,
          scaleX: 2.2,
          scaleY: 1.2,
          radiusFactor: 0.55,
          bAlpha: 0.035,
          lBoost: Math.max(lightning1, lightning3) * 0.08,
          driftX: Math.cos(globalTime * 0.011) * 60,
          driftY: Math.sin(globalTime * 0.013) * 40,
          rotation: globalTime * 0.003
        }
      ];

      for (let i = 0; i < fogBanks.length; i++) {
        const f = fogBanks[i];
        const x = f.baseX + f.driftX;
        const y = f.baseY + f.driftY;
        const rad = Math.min(width, height) * f.radiusFactor;
        const alpha = (f.bAlpha + f.lBoost) * (0.8 + Math.sin(globalTime * 0.2 + i * 1.5) * 0.2);

        if (alpha > 0.001 && rad > 0) {
          ctx.save();
          try {
            ctx.globalCompositeOperation = "screen";
            ctx.translate(x, y);
            ctx.rotate(f.rotation);
            ctx.scale(f.scaleX, f.scaleY);

            const fogGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, rad);
            fogGrad.addColorStop(0, `rgba(${f.color}, ${alpha})`);
            fogGrad.addColorStop(0.35, `rgba(${f.color}, ${alpha * 0.45})`);
            fogGrad.addColorStop(0.70, `rgba(${f.color}, ${alpha * 0.12})`);
            fogGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

            ctx.fillStyle = fogGrad;
            ctx.beginPath();
            ctx.arc(0, 0, rad, 0, Math.PI * 2);
            ctx.fill();
          } catch(err) {
          } finally {
            ctx.restore();
          }
        }
      }

      ctx.globalCompositeOperation = "source-over";

      const timeIncrement = 0.0052 * breatheSpeed;
      globalTime += timeIncrement;
      rotY += 0.0024 * (driftSpeed * 0.4 + 0.6);
      rotX = Math.sin(globalTime * 0.06) * 0.10;

      const cameraDistance = baseRadius * 4.6;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const cx = width / 2;
      const cy = height / 2;

      for (let b = 0; b < BUCKET_COUNT; b++) {
        bucketX[b].length = 0;
        bucketY[b].length = 0;
        bucketS[b].length = 0;
      }

      const driftFactor = driftSpeed * 0.8;

      for (let i = 0; i < totalPoints; i++) {
        const i3 = i * 3;
        const x0 = basePoints[i3];
        const y0 = basePoints[i3 + 1];
        const z0 = basePoints[i3 + 2];

        const warpAmp1 = 0.52;
        const w1x = perlinNoise3D(x0 * 1.2 + globalTime * 0.25, y0 * 1.2, z0 * 1.2) * warpAmp1;
        const w1y = perlinNoise3D(x0 * 1.2, y0 * 1.2 + globalTime * 0.25, z0 * 1.2 + 15.0) * warpAmp1;
        const w1z = perlinNoise3D(x0 * 1.2 + 30.0, y0 * 1.2, z0 * 1.2 + globalTime * 0.25) * warpAmp1;

        const x1 = x0 + w1x;
        const y1 = y0 + w1y;
        const z1 = z0 + w1z;

        const warpAmp2 = 0.22;
        const w2x = perlinNoise3D(x1 * 4.0 - globalTime * 0.65, y1 * 4.0, z1 * 4.0) * warpAmp2;
        const w2y = perlinNoise3D(x1 * 4.0, y1 * 4.0 + globalTime * 0.65, z1 * 4.0 + 50.0) * warpAmp2;
        const w2z = perlinNoise3D(x1 * 4.0 + 100.0, y1 * 4.0, z1 * 4.0 - globalTime * 0.55) * warpAmp2;

        const xWarped = x1 + w2x;
        const yWarped = y1 + w2y;
        const zWarped = z1 + w2z;

        const scale1 = 1.5;
        const n1 = perlinNoise3D(xWarped * scale1, yWarped * scale1, zWarped * scale1 + globalTime * 0.55);
        const crease1 = 1.0 - Math.abs(n1);

        const scale2 = 4.4;
        const n2 = perlinNoise3D(xWarped * scale2 - globalTime * 0.95, yWarped * scale2, zWarped * scale2 + globalTime * 0.85);
        const crease2 = 1.0 - Math.abs(n2);

        const ridgeVal = Math.pow(crease1 * 0.74 + crease2 * 0.26, 2.5);

        const lfScale = 0.75;
        const lfCaving = perlinNoise3D(x0 * lfScale + globalTime * 0.12, y0 * lfScale, z0 * lfScale) * 0.42;

        const R = baseRadius * (0.83 + lfCaving + ridgeVal * 0.82);

        const twistAngle = (yWarped * 1.0 + perlinNoise3D(xWarped * 0.6, yWarped * 0.6, zWarped * 0.6 + globalTime * 0.45) * 1.8) * driftFactor;
        const cosT = Math.cos(twistAngle);
        const sinT = Math.sin(twistAngle);

        let x = xWarped * cosT - zWarped * sinT;
        let y = yWarped;
        let z = xWarped * sinT + zWarped * cosT;

        x *= R;
        y *= R;
        z *= R;

        const microScale = 5.2;
        const turbSpeed = globalTime * 1.4;
        x += perlinNoise3D(xWarped * microScale, yWarped * microScale, zWarped * microScale - turbSpeed) * baseRadius * 0.055;
        y += perlinNoise3D(xWarped * microScale + 30, yWarped * microScale, zWarped * microScale + turbSpeed) * baseRadius * 0.055;
        z += perlinNoise3D(xWarped * microScale, yWarped * microScale + 30, zWarped * microScale + turbSpeed * 0.8) * baseRadius * 0.055;

        let rx1 = x * cosY - z * sinY;
        let rz1 = x * sinY + z * cosY;

        let ry = y * cosX - rz1 * sinX;
        let rz = y * sinX + rz1 * cosX;

        const depthFactor = cameraDistance / (cameraDistance + rz);
        let drawX = cx + rx1 * depthFactor;
        let drawY = cy + ry * depthFactor;

        if (drawX < 0 || drawX >= width || drawY < 0 || drawY >= height) {
          continue;
        }

        const normalizedZ = (rz + baseRadius * 1.5) / (baseRadius * 3.0);
        let alpha = maxAlpha * (1.35 - normalizedZ * 0.7);

        alpha *= Math.pow(crease1, 2.7);

        const lightX = -0.55;
        const lightY = -0.45;
        const lightZ = 0.7;
        const dot = x0 * lightX + y0 * lightY + z0 * lightZ;
        const diffuse = Math.max(0.3, (dot + 1.0) * 0.5);
        alpha *= diffuse;

        alpha *= (0.4 + 0.6 * ridgeVal);

        const focalPlane = 0.36;
        const focalDistance = Math.abs(normalizedZ - focalPlane);
        const focusFade = Math.max(0.4, 1.0 - focalDistance * 1.15);
        alpha *= focusFade;

        const finalAlpha = Math.max(0.0, Math.min(1.0, alpha));

        if (finalAlpha > 0.012) {
          let renderSize = grainSize * 1.25 * (0.65 + (1.0 - normalizedZ) * 0.7) * (1.0 + focalDistance * 0.1);
          const bucketIdx = Math.min(BUCKET_COUNT - 1, Math.floor(finalAlpha * (BUCKET_COUNT - 1)));
          bucketX[bucketIdx].push(drawX);
          bucketY[bucketIdx].push(drawY);
          bucketS[bucketIdx].push(renderSize);
        }
      }

      for (let b = 0; b < BUCKET_COUNT; b++) {
        const xs = bucketX[b];
        const len = xs.length;
        if (len === 0) continue;

        const ys = bucketY[b];
        const ss = bucketS[b];
        const alphaFraction = (0.12 + 0.88 * (b / (BUCKET_COUNT - 1))) * maxAlpha;

        const colorPhase = (b / (BUCKET_COUNT - 1) + globalTime * 0.15) % 1.0;

        let rgb = [0, 0, 0];
        if (colorPhase < 0.33) {
          const f = colorPhase / 0.33;
          rgb[0] = Math.round(lerp(f, 0, 170));
          rgb[1] = Math.round(lerp(f, 255, 70));
          rgb[2] = Math.round(lerp(f, 255, 255));
        } else if (colorPhase < 0.66) {
          const f = (colorPhase - 0.33) / 0.33;
          rgb[0] = Math.round(lerp(f, 170, 255));
          rgb[1] = Math.round(lerp(f, 70, 80));
          rgb[2] = Math.round(lerp(f, 255, 210));
        } else {
          const f = (colorPhase - 0.66) / 0.34;
          rgb[0] = Math.round(lerp(f, 255, 0));
          rgb[1] = Math.round(lerp(f, 80, 255));
          rgb[2] = Math.round(lerp(f, 210, 255));
        }

        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alphaFraction})`;
        ctx.beginPath();
        for (let idx = 0; idx < len; idx++) {
          const s = ss[idx];
          ctx.rect(xs[idx] - s / 2, ys[idx] - s / 2, s, s);
        }
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [dimensions, density, driftSpeed, breatheSpeed, grainSize, maxAlpha, colorTheme, interactive]);

  return (
    <div
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-[#000000]"
      id="velvet-noise-container"
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full opacity-100"
        id="velvet-noise-canvas"
      />
    </div>
  );
}