declare module "html-to-image" {
  export type Options = {
    cacheBust?: boolean;
    pixelRatio?: number;
    backgroundColor?: string;
    filter?: (node: Node) => boolean;
  };

  export function toBlob(node: HTMLElement, options?: Options): Promise<Blob | null>;
}

