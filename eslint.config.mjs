import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = [
  ...coreWebVitals,
  ...nextTypeScript,
  {
    ignores: [".next/**", ".next*/**"]
  },
  {
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "import/no-anonymous-default-export": "off"
    }
  }
];

export default eslintConfig;
