import { motion } from "motion/react";
import { Sliders, RotateCcw, HelpCircle, EyeOff, Eye } from "lucide-react";
import { CanvasSettings } from "../types";

interface CanvasControlsProps {
  settings: CanvasSettings;
  setSettings: (s: CanvasSettings) => void;
  canvasActive: boolean;
  setCanvasActive: (b: boolean) => void;
  defaultSettings: CanvasSettings;
}

export default function CanvasControls({
  settings,
  setSettings,
  canvasActive,
  setCanvasActive,
  defaultSettings,
}: CanvasControlsProps) {
  const presets = [
    {
      name: "Cosmic Quiet",
      desc: "Slow, extremely low-opacity dust field.",
      config: { density: 0.7, driftSpeed: 0.4, breatheSpeed: 0.5, grainSize: 0.8, maxAlpha: 0.25 },
    },
    {
      name: "Tactile Grain",
      desc: "High-density fine grain with tiny particles.",
      config: { density: 1.6, driftSpeed: 0.7, breatheSpeed: 0.8, grainSize: 0.6, maxAlpha: 0.35 },
    },
    {
      name: "Volumetric Smoke",
      desc: "Slightly larger puff particles, highly responsive drift.",
      config: { density: 1.1, driftSpeed: 1.5, breatheSpeed: 1.6, grainSize: 1.6, maxAlpha: 0.5 },
    },
  ];

  const handleSliderChange = (key: keyof CanvasSettings, val: number) => {
    setSettings({
      ...settings,
      [key]: val,
    });
  };

  const resetToDefault = () => {
    setSettings({ ...defaultSettings });
  };

  return (
    <div 
      className="w-full bg-[#0a0a0a]/75 backdrop-blur-md rounded-2xl border border-white/[0.08] p-6 lg:p-8"
      id="velvet-control-deck"
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-white/70 animate-pulse" />
          <h3 className="font-display font-medium text-sm tracking-widest text-white uppercase">
            Velvet Noise Control Room
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCanvasActive(!canvasActive)}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-white/[0.04] border border-white/10 text-[10px] font-mono hover:bg-white/[0.08] transition-colors text-white/80 cursor-pointer"
            title={canvasActive ? "Mute Background Animation" : "Resume Background Animation"}
          >
            {canvasActive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {canvasActive ? "DAMP BACKDROP" : "RESTORE BACKDROP"}
          </button>
          <button
            onClick={resetToDefault}
            className="p-1 px-2 rounded bg-white/[0.02] border border-white/[0.05] text-[#8e8e89] hover:text-white transition-colors cursor-pointer"
            title="Reset Canvas Parameters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <p className="text-xs font-sans text-[#8e8e89] leading-relaxed mb-6">
        Adjust parameters to sculpt the ambient cloud layer behind this website. 
        Calculated locally on-canvas via 3D multi-octave trigonometric noise fields.
      </p>

      {/* Preset Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {presets.map((preset) => {
          const isSelected = 
            Math.abs(settings.density - preset.config.density) < 0.05 &&
            Math.abs(settings.driftSpeed - preset.config.driftSpeed) < 0.05 &&
            Math.abs(settings.breatheSpeed - preset.config.breatheSpeed) < 0.05 &&
            Math.abs(settings.grainSize - preset.config.grainSize) < 0.05;

          return (
            <button
               key={preset.name}
               onClick={() => {
                 setSettings({
                   ...preset.config,
                   colorTheme: settings.colorTheme,
                 });
                 if (!canvasActive) setCanvasActive(true);
               }}
               className={`p-3 rounded-lg text-left border transition-all text-xs cursor-pointer ${
                isSelected
                  ? "bg-white/[0.06] border-white/30"
                  : "bg-white/[0.01] border-white/[0.04] hover:bg-white/[0.03] hover:border-white/10"
              }`}
            >
              <div className="font-mono text-[10px] text-white/90 mb-1">
                {preset.name}
              </div>
              <div className="text-[9px] text-[#8e8e89] line-clamp-2 leading-normal">
                {preset.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Spectral Palettes */}
      <div className="mb-8 border-t border-white/[0.06] pt-5">
        <h4 className="text-[10px] font-mono tracking-widest text-[#8e8e89] uppercase mb-3">
          AESTHETIC SPECTRAL PALETTE
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: "silver", name: "COSMIC SILVER", color: "from-[#eef2f3] to-[#8e9eab]", badge: "bg-white/40" },
            { id: "gold", name: "AMBER LUXE", color: "from-[#f12711] to-[#f5af19]", badge: "bg-amber-400/40" },
            { id: "emerald", name: "JADE AURORA", color: "from-[#11998e] to-[#38ef7d]", badge: "bg-emerald-400/40" },
            { id: "sunset", name: "NEBULA COY", color: "from-[#f953c6] to-[#b91d73]", badge: "bg-fuchsia-400/40" },
          ].map((theme) => {
            const isSelected = settings.colorTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => {
                  setSettings({ ...settings, colorTheme: theme.id as any });
                  if (!canvasActive) setCanvasActive(true);
                }}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                  isSelected
                    ? "bg-white/[0.05] border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.02)]"
                    : "bg-white/[0.01] border-transparent hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${theme.color} shrink-0`} />
                  <span className="font-mono text-[8px] text-[#8e8e89] leading-none tracking-wider">
                    {theme.id.toUpperCase()}
                  </span>
                </div>
                <div className={`font-serif italic text-[11px] leading-tight ${isSelected ? "text-white" : "text-[#8e8e89]"}`}>
                  {theme.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="space-y-5">
        {/* Particle Density */}
        <div>
          <div className="flex justify-between text-[11px] font-mono tracking-wider text-[#8e8e89] mb-1.5">
            <span className="flex items-center gap-1 uppercase">
              Particle Cluster Density
            </span>
            <span className="text-white bg-white/5 px-1.5 py-0.5 rounded text-[10px]">
              {(settings.density * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0.2"
            max="2.5"
            step="0.1"
            value={settings.density}
            onChange={(e) => handleSliderChange("density", parseFloat(e.target.value))}
            className="w-full accent-white brightness-90 bg-white/10 h-1 rounded-lg cursor-pointer"
            id="control-slider-density"
          />
          <div className="flex justify-between text-[8px] font-mono text-white/30 mt-1">
            <span>FINITE</span>
            <span>VOLUMETRIC</span>
          </div>
        </div>

        {/* Drift Speed */}
        <div>
          <div className="flex justify-between text-[11px] font-mono tracking-wider text-[#8e8e89] mb-1.5">
            <span className="flex items-center gap-1 uppercase">
              Field Drift Velocity
            </span>
            <span className="text-white bg-white/5 px-1.5 py-0.5 rounded text-[10px]">
              {settings.driftSpeed.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="2.5"
            step="0.1"
            value={settings.driftSpeed}
            onChange={(e) => handleSliderChange("driftSpeed", parseFloat(e.target.value))}
            className="w-full accent-white brightness-90 bg-white/10 h-1 rounded-lg cursor-pointer"
            id="control-slider-drift"
          />
          <div className="flex justify-between text-[8px] font-mono text-white/30 mt-1">
            <span>STAGNANT</span>
            <span>GALE FORCE</span>
          </div>
        </div>

        {/* Breathe Speed */}
        <div>
          <div className="flex justify-between text-[11px] font-mono tracking-wider text-[#8e8e89] mb-1.5">
            <span className="flex items-center gap-1 uppercase">
              Cloud Breathing Hertz
            </span>
            <span className="text-white bg-white/5 px-1.5 py-0.5 rounded text-[10px]">
              {settings.breatheSpeed.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="3.0"
            step="0.1"
            value={settings.breatheSpeed}
            onChange={(e) => handleSliderChange("breatheSpeed", parseFloat(e.target.value))}
            className="w-full accent-white brightness-90 bg-white/10 h-1 rounded-lg cursor-pointer"
            id="control-slider-breathe"
          />
          <div className="flex justify-between text-[8px] font-mono text-white/30 mt-1">
            <span>FROZEN</span>
            <span>DYNAMIC MORPH</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Grain Scale */}
          <div>
            <div className="flex justify-between text-[11px] font-mono tracking-wider text-[#8e8e89] mb-1.5">
              <span className="uppercase">Grain Size</span>
              <span className="text-white bg-white/5 px-1.5 py-0.5 rounded text-[10px]">
                {settings.grainSize.toFixed(1)}px
              </span>
            </div>
            <input
              type="range"
              min="0.3"
              max="2.5"
              step="0.1"
              value={settings.grainSize}
              onChange={(e) => handleSliderChange("grainSize", parseFloat(e.target.value))}
              className="w-full accent-white brightness-90 bg-white/10 h-1 rounded-lg cursor-pointer"
              id="control-slider-grain"
            />
          </div>

          {/* Max Alpha */}
          <div>
            <div className="flex justify-between text-[11px] font-mono tracking-wider text-[#8e8e89] mb-1.5">
              <span className="uppercase">Master Opacity</span>
              <span className="text-white bg-white/5 px-1.5 py-0.5 rounded text-[10px]">
                {settings.maxAlpha.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.95"
              step="0.05"
              value={settings.maxAlpha}
              onChange={(e) => handleSliderChange("maxAlpha", parseFloat(e.target.value))}
              className="w-full accent-white brightness-90 bg-white/10 h-1 rounded-lg cursor-pointer"
              id="control-slider-alpha"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
