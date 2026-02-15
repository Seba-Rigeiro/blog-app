/**
 * Cliente tRPC para uso en componentes React.
 * Se usa con QueryClientProvider en ETAPA 4+.
 */

import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "./routers/_app";

export const trpc = createTRPCReact<AppRouter>();
