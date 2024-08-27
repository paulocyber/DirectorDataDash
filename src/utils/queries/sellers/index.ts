export const sellersQueries = () => {
  let sellers =
    "select id_pss, apelido_pss from pessoas where tipo_pss in('F','D')";

    return sellers
};
