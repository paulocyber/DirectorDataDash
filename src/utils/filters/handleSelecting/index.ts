"use client";

import { Dispatch, SetStateAction, useState } from "react";

export function handleSelecting(
  setSelecting: Dispatch<SetStateAction<string[]>>
) {
  const handleCheckboxChange = (name: string) => {
    setSelecting((prev) => {
      if (prev.includes(name)) {
        return prev.filter((item) => item !== name);
      } else {
        return [...prev, name];
      }
    });
  };

  return handleCheckboxChange;
}
