import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { AfomPasswordGate } from "./AfomPasswordGate";
import { AFOM_ACCESS_COOKIE, hasAfomAccess } from "./access";

export default async function FamilyOfMortalsLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const unlocked = hasAfomAccess(cookieStore.get(AFOM_ACCESS_COOKIE)?.value);

  return unlocked ? children : <AfomPasswordGate />;
}
