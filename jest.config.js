export default {
	testEnvironment: "ndoe",
	roots: ["<rootDir>/src"],
	clearMocks: true,
	collectCoverage: true,
	collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts", "!src/index.tsx", "!src/serviceWorker.ts"],
	coverageDirectory: "coverage",
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
	testMatch: ["<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}", "<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}"],
	moduleNameMapper: {
		"^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
		"^.+\\.(css|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
		"^.+\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
	},
	transform: {
		"^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
	},
	reporters: ["default", "jest-junit"],
	watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"],
	moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
	testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
	transformIgnorePatterns: ["/node_modules/", "^.+\\.module\\.(css|sass|scss)$"],
	globals: {
		"ts-jest": {
			tsconfig: "<rootDir>/tsconfig.jest.json",
		},
	},
};
