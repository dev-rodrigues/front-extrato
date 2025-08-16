/// <reference types="vitest" />

declare global {
  namespace Vi {
    interface JestAssertion<T = any> extends CustomMatchers<T> {}
  }
}

export {}
