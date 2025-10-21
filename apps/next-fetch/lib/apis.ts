// 실제 네트워크 지연을 시뮬레이션하는 Mock API

export interface Post {
  id: number;
  title: string;
  body: string;
  loadTime: number;
}

export interface Comment {
  id: number;
  postId: number;
  text: string;
  loadTime: number;
}

// 지연 시간을 시뮬레이션하는 헬퍼 함수
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Posts API - 3초 지연
export async function fetchPosts(): Promise<Post[]> {
  const startTime = Date.now();
  await delay(3000); // 3초 대기

  return [
    {
      id: 1,
      title: "First Post",
      body: "This is the first post content",
      loadTime: Date.now() - startTime,
    },
    {
      id: 2,
      title: "Second Post",
      body: "This is the second post content",
      loadTime: Date.now() - startTime,
    },
    {
      id: 3,
      title: "Third Post",
      body: "This is the third post content",
      loadTime: Date.now() - startTime,
    },
  ];
}

// Comments API - 2초 지연
export async function fetchComments(): Promise<Comment[]> {
  const startTime = Date.now();
  await delay(2000); // 2초 대기

  return [
    {
      id: 1,
      postId: 1,
      text: "Great post!",
      loadTime: Date.now() - startTime,
    },
    {
      id: 2,
      postId: 1,
      text: "Thanks for sharing",
      loadTime: Date.now() - startTime,
    },
  ];
}

// User API - 1초 지연
export async function fetchUser(): Promise<{
  id: number;
  name: string;
  loadTime: number;
}> {
  const startTime = Date.now();
  await delay(1000); // 1초 대기

  return {
    id: 1,
    name: "John Doe",
    loadTime: Date.now() - startTime,
  };
}
