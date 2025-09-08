export function convertMaskPercent(value: string) {
  return (parseInt(value.replace(/\D/g, "")) * 0.01).toLocaleString("pt-BR", {
    style: "percent",
  });
}
