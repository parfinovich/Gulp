import autoprefixer from 'autoprefixer';

const config = {
	plugins: [
		autoprefixer({
			grid: true,
			overrideBrowserslist: ['last 2 versions', '> 1%', 'ie >= 11']
		})
	]
};

export default config;
