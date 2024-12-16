import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'

export default {
  input: 'demo/demo.js',
  output: {
    file: 'demo/bundle.min.js',
    name: 'geoparquet',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    // terser(),
  ],
}
