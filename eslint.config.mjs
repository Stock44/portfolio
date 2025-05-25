import { defineConfig, globalIgnores } from 'eslint/config';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

export default defineConfig([
	globalIgnores(['dist/', '.idea/', '.astro/']),
	eslint.configs.recommended,
	tsEslint.configs.recommended,
	eslintConfigPrettier,
	eslintPluginUnicorn.configs.recommended,
	...eslintPluginAstro.configs['jsx-a11y-recommended'],
	{
		rules: {
			'unicorn/filename-case': [
				'error',
				{
					cases: {
						kebabCase: true,
					},
					ignore: [String.raw`.+\.astro$`],
				},
			],
			'unicorn/prevent-abbreviations': [
				'error',
				{
					replacements: {
						props: false,
						env: false,
					},
				},
			],
		},
	},
	{
		files: ['**/*.astro'],
		rules: {
			'unicorn/filename-case': ['error', { cases: { pascalCase: true } }],
		},
	},
]);
