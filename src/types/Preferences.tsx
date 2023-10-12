export type Preferences = {
    editorWidth: string,
    editorPosition: string,
}

export enum EditorWidth {
    full = "max-w-full",
    half = "max-w-[1024px]",
  }
  
export enum EditorPosition {
    center = "mx-auto",
    start = "",
  }