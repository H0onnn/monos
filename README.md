# Monorepo with turbo

## Turborepo?

> Vercel에서 개발한 JS/TS 모노레포 빌드 시스템

### 주요 장점

1. 캐싱 및 병렬 실행
   - 같은 작업을 여러 번 실행하지 않고 빌드 결과를 캐싱하여 불필요한 중복 빌드 방지
   - 여러 패키지의 빌드를 병렬로 실행하여 속도 최적화
2. 효율적인 의존성 관리
   - 각 패키지의 의존성을 분석하여, 변경된 부분만 재빌드
   - `turbo run build` 와 같은 명령어로 변경된 패키지만 다시 빌드 -> 시간 단축
3. 원격 캐싱
   - Vercel과 통합하여 팀원들끼리 캐싱 공유 가능
   - 로컬에서 빌드한 결과물을 다른 팀원이 다시 실행할 때 재사용 가능

### Turborepo 프로젝트 생성

```bash
pnpm dlx create-turbo@latest // pnpm
yarn dlx create-turbo@latest // yarn
npx create-turbo@latest // npm
bunx create-turbo@latest // bun (beta)
```
해당 repo에서는 `bun` 을 사용하였음.

### 1. workspace

`bunx` 로 생성한 프로젝트에서는 `pnpm` 처럼 workspace.yaml 파일이 아닌, `root package.json` 에서 workspace를 관리함

```json
"workspaces": [
    "apps/*",
    "packages/*"
  ]
```

위 처럼 모노레포 내에서 관리할 패키지들의 경로를 지정.
등록된 패키지들은 서로 각 폴더 내 package.json의 dependencies로 추가해 서로 의존할 수 있으며, install시 각 패키지의 최신 버전이 반영되어 중복 코드를 쉽게 관리할 수 있음

```json
// apps/web/package.json

"dependencies": {
  "@repo/ui": "*",
},
```

`packages/ui` 패키지를 `apps/web` 에서 사용하기 위해, 위와 같이 사용할 패키지의 name과 버전을 지정해

### 2. turbo.json

```json
// root turbo.json

{
  "$schema": "https://turborepo.com/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "check-types": {
      "dependsOn": ["^check-types"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

turbo.json은 Turborepo에서 **빌드, 테스트, 린트, 배포 등의 작업을 구성하는 핵심 설정 파일임**
이 파일을 통해 모노레포 내에서 각 패키지의 작업 실행 순서, 캐싱, 병렬 실행 등을 효율적으로 관리할 수 있음

#### 2-1. tasks

```json
{
  "tasks": {
    "build": {
      ...
    },
    "lint": {
      ...
    },
  }
}
```

tasks는 turbo.json에서 각 작업의 실행 방식, 순서, 캐싱, 입출력 파일 등을 정의하는 곳
tasks 내부 속성들의 key 값들은 실행 가능한 작업으로 등록되고, `turbo run <key>` 로 실행 가능
예를 들어, `turbo run build`를 실행하면 모든 패키지의 build 명령어가 실행됨

#### 2-2. dependsOn

```json
"dependsOn": ["^build"]
```

dependsOn은 작업 간의 의존 관계를 설정할 때 사용.
특정 작업을 실행하기 전에 다른 작업이 먼저 실행되도록 지정할 수 있어, 이를 통해 작업 실행 순서를 명시적으로 조정

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "test": {
      "dependsOn": ["build", "lint"]
    }
  }
}
```

- "build": { "dependsOn": ["^build"] }
  - ^build는 현재 작업뿐만 아니라, 의존하는 모든 패키지에서 build 작업을 먼저 실행하도록 설정
  - build 작업이 실행되기 전, 모든 의존성 패키지들의 build를 완료 함
  - 예를 들어, `web` 패키지가 `ui` 패키지를 의존하고 있으면, `web` build 전 `ui` 가 먼저 빌드됨

- "test": { "dependsOn": ["build", "lint"] }
  - test 작업을 실행하기 전에 build와 lint 작업이 먼저 완료되도록 함
 
#### 2-3. 캐싱

```json
{
  "tasks": {
    "build": {
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

- cache
  - 캐싱 활성화 여부
  - false면 캐싱하지 않고 매번 새로 실행
 
- presistent
  - 지속 실행 여부
  - true면 실행 후 종료되지 않고 계속 실행 (watch mode)
 
- inputs
  - 캐싱 무효화 할 파일을 지정
 
- outputs
  - 특정 폴더를 빌드 결과물로 지정하여 캐싱 -> 변화 유무에 따라 재생성
 
### 3. 의존성 관리

#### 3-1. packages에서 관리되는 공통 코드

- UI 컴포넌트
  - 버튼, 모달 등 재사용 가능한 디자인 요소 `ex: packages/ui`
 
- 공용 hooks
  - auth, data fetch 등 여러 앱에서 공용으로 사용되는 hooks `ex: packages/hooks`
 
- 유틸 함수 및 헬퍼
  - 문자열 처리, 날짜 포매팅, API 요청 등 범용 유틸리티 `ex: packages/utils`
 
- 타입 및 인터페이스
  - 서버/API 응답, 비즈니스 로직의 공통 타입 스키마 `ex: packages/types`
 
- 공용 설정 파일
  - ESLint, Prettier, Jest, tsconfig 등 개발 환경 설정 모듈화 `ex: packages/config`
 
#### 3-2. 외부 의존성

`apps` 내에 여러 서비스가 있을 경우 각 앱의 package.json에 사용하는 외부 라이브러리 (ex: react, tanstack-query, nuqs 등)를 명시적으로 추가 해야 함

이는 각 앱에서 의존성의 버전을 확실히 관리하고, 빌드할 때 의존성 충동을 방지하기 위함

#### 3-3. peerDependencies

공용 패키지와 앱 간 라이브러리의 버전 일치와 호환성 관리를 위해 사용.
패키지가 실제로 동작하기 위해 반드시 필요하지만, 직접 설치하지 않고, 사용하는 쪽 (앱)에서 따로 설치해야 하는 오부 라이브러리 버전을 명시

```json
// packages/ui/package.json

"peerDependencies": {
  "react": "^18.0.0",
  "styled-components": "^6.0.0"
}

// apps/web/package.json

"dependencies": {
  "react": "^18.2.0",
  "styled-components": "6.1.8",
  "@repo/ui": "*"
}
```

참고 : pnpm version hoisting
* https://joonggon.me/posts/pnpm-workspace-peer-dependency-resolve
