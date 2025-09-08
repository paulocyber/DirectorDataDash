export default function GetGroupName(company: string[]): string {
  const allGroups = ["1", "2", "3", "4"];

  if (company.length === 1 && company.includes("1")) return "PlayCell";
  if (company.length === 1 && company.includes("2")) return "PlayPerson";
  if (company.length === 1 && company.includes("3")) return "PlayUp";
  if (company.length === 1 && company.includes("4")) return "PlayCapas";
  if (allGroups.every((group) => company.includes(group))) return "Grupo Play";

  return "Grupo Desconhecido";
}
