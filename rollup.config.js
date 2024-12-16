import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/geoparquet.min.js',
    name: 'geoparquet',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    terser(),
  ],
  external: ['react', 'react-dom'],
}
