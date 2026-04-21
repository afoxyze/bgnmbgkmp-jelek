import { NextResponse } from "next/server";
import { getCaseStudy, getLiveStats } from "@/lib/data";

export async function GET() {
  try {
    const [data, stats] = await Promise.all([
      getCaseStudy(true),
      getLiveStats()
    ]);

    if (!data) {
      return NextResponse.json({ error: "Data not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...data,
      stats
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
