import { getAuth } from "@/lib/auth";

export async function GET(request: Request) {
  const auth = await getAuth();
  return auth.handler(request);
}

export async function POST(request: Request) {
  const auth = await getAuth();
  return auth.handler(request);
}

export async function PATCH(request: Request) {
  const auth = await getAuth();
  return auth.handler(request);
}

export async function PUT(request: Request) {
  const auth = await getAuth();
  return auth.handler(request);
}

export async function DELETE(request: Request) {
  const auth = await getAuth();
  return auth.handler(request);
}
