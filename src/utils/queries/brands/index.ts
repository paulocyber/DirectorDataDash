export const brandsQueries = () => {
    let brands = `select * FROM marcas mrc WHERE DESCRICAO_MRC NOT LIKE '%DISPONIVEL%'`

    return brands
}