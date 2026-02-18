import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import glsl from "vite-plugin-glsl";

export default defineConfig({
	plugins: [tailwindcss(), glsl()],
	base: "/three-ml-sharp/",
});
