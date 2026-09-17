import { execFileSync } from 'node:child_process';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
  let commit = process.env.GITHUB_SHA || '';
  if (!/^[a-f0-9]{40}$/i.test(commit)) {
    try {
      commit = execFileSync('git', ['rev-parse', 'HEAD'], {
        cwd: new URL('.', import.meta.url), encoding: 'utf8',
      }).trim();
    } catch {
      commit = '';
    }
  }
  return {
    plugins: [{
      name: 'production-adsense',
      apply: 'build',
      transformIndexHtml() {
        return [{
          tag: 'script',
          attrs: {
            async: true,
            src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4015788090404207',
            crossorigin: 'anonymous',
          },
          injectTo: 'head',
        }];
      },
    }],
    define: {
      __BUILD_COMMIT__: JSON.stringify(commit),
      __IS_LOCAL_DEV__: JSON.stringify(command === 'serve'),
    },
  };
});
