import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
	{
		ignores: ["node_modules/**", "**/lib/*", "playwright-report/**"],
	},
	{
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
			},
		},
		plugins: {
			"@typescript-eslint": typescriptEslint,
			prettier,
		},
		rules: {
			...typescriptEslint.configs.recommended.rules,
			...prettierConfig.rules,
			"linebreak-style": ["error", "unix"],
			quotes: ["error", "double"],
			semi: ["error", "always"],
			"no-empty-pattern": "off",
		},
	},
];
