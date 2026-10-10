import type { HeroConstant } from "../types";
import { useConstant } from "./useConstants";

export const useHeroes = () => {
  const query = useConstant<Record<string, HeroConstant>>("heroes");

  return {
    heroes: query.constant ?? {},
    ...query,
  };
};
