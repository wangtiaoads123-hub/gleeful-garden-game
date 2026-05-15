import { loadFont as loadDisplay } from "@remotion/google-fonts/Orbitron";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";

export const display = loadDisplay("normal", { weights: ["700", "900"] }).fontFamily;
export const body = loadBody("normal", { weights: ["400", "600", "700"] }).fontFamily;

export const C = {
  bg: "#05010f",
  cyan: "#00ffd1",
  pink: "#ff2e88",
  white: "#ffffff",
  dim: "rgba(255,255,255,0.7)",
};
