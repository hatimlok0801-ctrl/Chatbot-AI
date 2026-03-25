export async function shareNodeAsImage(options: {
  node: HTMLElement;
  fileName: string;
}) {
  const { node, fileName } = options;

  const { toBlob } = await import("html-to-image");

  const blob = await toBlob(node, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: "#050509",
    filter: (n: Node) => {
      if (!(n instanceof HTMLElement)) return true;
      return !n.hasAttribute("data-noscreenshot");
    }
  });

  if (!blob) throw new Error("Failed to generate image.");

  const file = new File([blob], fileName, { type: "image/png" });

  // Prefer native share when available (mobile-first virality).
  const nav = navigator as unknown as {
    share?: (data: { files?: File[]; title?: string; text?: string }) => Promise<void>;
    canShare?: (data: { files?: File[] }) => boolean;
  };

  if (nav.share && nav.canShare?.({ files: [file] })) {
    await nav.share({ files: [file], title: "RESPECT.EXE" });
    return { method: "share" as const };
  }

  // Next best: copy image to clipboard (Chrome/Edge support varies by context).
  const w = window as unknown as {
    ClipboardItem?: new (items: Record<string, Blob>) => ClipboardItem;
  };
  if (navigator.clipboard?.write && w.ClipboardItem) {
    await navigator.clipboard.write([new w.ClipboardItem({ "image/png": blob })]);
    return { method: "clipboard" as const };
  }

  // Fallback: download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return { method: "download" as const };
}
