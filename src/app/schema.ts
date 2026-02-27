export function jsonLd(data: unknown) {
  return {
    __html: JSON.stringify(data),
  };
}
