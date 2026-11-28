import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import posthog from '@posthog/rollup-plugin';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const plugins = [react()];

	if (env.POSTHOG_API_KEY && env.POSTHOG_PROJECT_ID) {
		plugins.push(posthog({
			personalApiKey: env.POSTHOG_API_KEY,
			projectId: env.POSTHOG_PROJECT_ID,
			host: env.POSTHOG_HOST || 'https://us.i.posthog.com',
			sourcemaps: {
				enabled: true,
				releaseName: 'cultgig-web',
				deleteAfterUpload: true,
			},
		}));
	}

	return {
		plugins,
		server: {
			host: '0.0.0.0',
			port: 3000,
			allowedHosts: true,
		},
		build: {
			sourcemap: true,
		},
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
			},
		},
	};
});
