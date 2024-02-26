import React from 'react'

// Dados
import davJson from "./../data/Dav.json";

export const valuesDavs = () => {
    let valueDav = 0

    for (const dav of davJson) {
        valueDav += dav['Dv.Value']
    }

    return { valueDav }
}
