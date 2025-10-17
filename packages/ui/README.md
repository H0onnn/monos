# monorepo에 tailwind v4 세팅

### 1. packages/ui에 tailwind 세팅

```bash
bun add -D tailwindcss @tailwindcss/postcss postcss
```

```json
// packages/ui/package.json

"devDependencies": {
    "tailwindcss": "^4.1.14",
    "postcss": "^8.5.6",
    "@tailwindcss/postcss": "^4.1.14",
}
```

#### 1-1. postcss config 파일 작성 및 export

```mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

```json
// packages/ui/package.json

"exports": {
    "./*": "./src/*.tsx",
    "./postcss.config": "./postcss.config.mjs", // 경로에 맞게 추가
  },
```

#### 1-2. 공용 토큰을 관리할 css파일 작성 및 export

```css
/* packages/ui/src/styles/default.css */

@import "tailwindcss";

@theme {
  --color-midnight: #121063;
  --color-tahiti: #3ab7bf;
  --color-bermuda: #78dcca;
}
```

```json
// packages/ui/package.json

"exports": {
    "./*": "./src/*.tsx",
    "./postcss.config": "./postcss.config.mjs",
    "./styles/*": "./src/styles/*" // 경로에 맞게 추가
  },
```

**tailwind v4에서는 tailwind.config 파일을 사용하지 않기 때문에 @theme 내부에 토큰을 설정 해줘야 함**

### 2. apps에서 사용

```bash
bun add -D tailwindcss @tailwindcss/postcss postcss --filter=web
```

```json
// apps/web/package.json

"dependencies": {
    "@repo/ui": "*", // @repo/ui 로컬 패키지를 추가
},
"devDependencies": {
    "tailwindcss": "^4.1.14",
    "postcss": "^8.5.6",
    "@tailwindcss/postcss": "^4.1.14",
}
```

#### 2-1. postcss config 파일 작성

```mjs
// apps/web/postcss.config.mjs

export { default } from "@repo/ui/postcss.config"; // @repo/ui 패키지에서 작성한 config 파일을 import 및 export
```

#### 2-2. globals.css 파일 작성

```css
/* apps/web/app/globals.css */

@import "tailwindcss";
@import "@repo/ui/styles/default.css";
/* @repo/ui 패키지의 default.css를 import */

@source '../../../packages/ui/';
/* tailwind v4에서는 tailwind.config의 'content' 부분을 @source로 대체 함 */
/* @source 경로를 지정하지 않으면 @repo/ui 패키지에서 작성된 컴포넌트에 tailwindcss 적용이 안되니 주의 */
```

#### 2-3. root layout.tsx

```tsx
// apps/web/app/layout.tsx

import "./globals.css"; // 이 부분 추가
```

#### 2-4. 사용 예시

```tsx
// apps/web/app/page.tsx

import { Button } from "@repo/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col gap-5">
      {/* 1. ui 패키지의 default.css에서  설정한 token을 사용할 수 있음 */}
      <div className="bg-tahiti w-full">tailwind test</div>
      {/* 2. tailwindcss로 스타일링 된 공용 컴포넌트를 사용할 때 정상적으로 스타일링이 적용 됨 */}
      <Button appName="web">Click me</Button>
    </div>
  );
}
```
