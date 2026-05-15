import { loadFont as loadDisplay } from "@remotion/google-fonts/Orbitron";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";
import { loadFont as loadSC } from "@remotion/google-fonts/NotoSansSC";
import { loadFont as loadJP } from "@remotion/google-fonts/NotoSansJP";
import { loadFont as loadKR } from "@remotion/google-fonts/NotoSansKR";

const dispF = loadDisplay("normal", { weights: ["700", "900"] }).fontFamily;
const bodyF = loadBody("normal", { weights: ["400", "600", "700"] }).fontFamily;
const sc = loadSC("normal", { weights: ["600"] }).fontFamily;
const jp = loadJP("normal", { weights: ["600"] }).fontFamily;
const kr = loadKR("normal", { weights: ["600"] }).fontFamily;

export const display = `${dispF}, ${sc}, ${jp}, ${kr}, sans-serif`;
export const body = `${bodyF}, ${sc}, ${jp}, ${kr}, sans-serif`;

export const C = {
  bg: "#05010f",
  cyan: "#00ffd1",
  pink: "#ff2e88",
  white: "#ffffff",
  dim: "rgba(255,255,255,0.7)",
};
