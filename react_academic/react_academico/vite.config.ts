import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import tsconfigPaths from 'vite-tsconfig-paths'; // prettier pediu pra comentar este import

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
});

// a função abaixo foi adicionada pois o tsconfigPaths estava dando erro por causa do prettier

function tsconfigPaths(): import("vite").PluginOption {
  throw new Error('Function not implemented.');
}

