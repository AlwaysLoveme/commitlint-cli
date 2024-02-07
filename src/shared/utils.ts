/**
 * console 文本居中
 * @param text
 * @param width
 * @returns
 */
export function centerText(text: string, width = process.stdout.columns) {
  const padding = Math.max(0, (width - text.length) / 2);
  return " ".repeat(padding) + text + " ".repeat(padding);
}
