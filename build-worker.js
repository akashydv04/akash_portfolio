import esbuild from 'esbuild';

esbuild.build({
    entryPoints: ['src/worker.js'],
    bundle: true,
    outfile: 'dist/_worker.js',
    format: 'esm',
    platform: 'browser',
    target: 'es2022',
    minify: true,
}).catch(() => process.exit(1));
