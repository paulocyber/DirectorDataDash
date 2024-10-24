export const getEmpName = (emp: string) => {
  const emps = ["PlayCell", "PlayPersonalizados", "PlayUp", "CD"];

  return emps[parseInt(emp) - 1];
};
