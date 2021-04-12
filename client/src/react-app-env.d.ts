/// <reference types="react-scripts" />
declare global {
  interface ObjectConstructor {
    keys<T>(obj: T): Array<keyof T>
  }
}

export {};