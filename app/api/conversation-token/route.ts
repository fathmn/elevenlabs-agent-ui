import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

function disabledResponse() {
  return NextResponse.json(
    { error: "Not found" },
    {
      status: 404,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  )
}

export function GET() {
  return disabledResponse()
}

export function POST() {
  return disabledResponse()
}

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: "GET, POST, OPTIONS",
      "Cache-Control": "no-store",
    },
  })
}
