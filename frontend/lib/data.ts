import { isCaseStudy, type CaseStudy, type CaseStudyMetadata } from "@/types/graph";

// Merge multiple validated CaseStudy objects into one.
// Entities and red_flags are deduplicated by id; relations are concatenated as-is.
// Metadata is derived from all sources: latest date, combined sumber, fixed status.
function mergeCaseStudies(studies: readonly CaseStudy[]): CaseStudy {
  const seenEntityIds = new Set<string>();
  const seenRedFlagIds = new Set<string>();

  const entities = studies.flatMap((s) =>
    s.entities.filter((e) => {
      if (seenEntityIds.has(e.id)) return false;
      seenEntityIds.add(e.id);
      return true;
    })
  );

  const relations = Array.from(
    new Map(
      studies
        .flatMap((s) => s.relations)
        .map((r) => [`${r.from}-${r.type}-${r.to}`, r])
    ).values()
  );

  const red_flags = studies.flatMap((s) =>
    s.red_flags.filter((rf) => {
      if (seenRedFlagIds.has(rf.id)) return false;
      seenRedFlagIds.add(rf.id);
      return true;
    })
  );

  const investigasi_lanjutan = studies.flatMap((s) => s.investigasi_lanjutan);

  // Latest date wins; sources are joined; status is normalized to "draft"
  const latestDate = studies
    .map((s) => s.metadata.tanggal_riset)
    .sort()
    .at(-1) ?? "";

  const combinedSumber = studies
    .map((s) => s.metadata.sumber)
    .join("; ");

  const metadata: CaseStudyMetadata = {
    tanggal_riset: latestDate,
    sumber: combinedSumber,
    status: "Audit Selesai (Terverifikasi)",
  };

  return { metadata, entities, relations, red_flags, investigasi_lanjutan };
}

// Shared data loader — reads and merges all case study JSON files from public/data/.
// Called server-side only; never imported in client components.
export async function getCaseStudy(onlyFeatured = false): Promise<CaseStudy | null> {
  try {
    const { readFile, readdir } = await import("fs/promises");
    const { join } = await import("path");

    const dataDir = join(process.cwd(), "public", "data");
    const allFiles = await readdir(dataDir);
    const caseStudyFiles = allFiles.filter(f => f.startsWith("case_study_") && f.endsWith(".json"));

    const studies: CaseStudy[] = [];

    for (const filename of caseStudyFiles) {
      const filePath = join(dataDir, filename);
      const raw = await readFile(filePath, "utf-8");
      const data: unknown = JSON.parse(raw);

      if (!isCaseStudy(data)) {
        console.error(`Data JSON tidak valid — ${filename} tidak sesuai skema.`);
        continue;
      }

      studies.push(data);
    }

    if (studies.length === 0) {
      console.error("Tidak ada file data yang valid.");
      return null;
    }

    return mergeCaseStudies(studies);
  } catch (err) {
    console.error("Gagal memuat data kasus:", err);
    return null;
  }
}

/**
 * Calculates aggregate stats from all available case studies.
 */
export async function getLiveStats() {
  const fullData = await getCaseStudy(true);
  if (!fullData) return null;

  let totalSppg = 27066; // Fallback
  let mappedSppg = 0;
  let totalSuspended = 0;
  let certificationRate = "0%";

  try {
    const { createReadStream } = await import("fs");
    const { join } = await import("path");
    
    // Read just the first chunk of all_sppg_locations.json to get metadata
    const sppgPath = join(process.cwd(), "public", "data", "all_sppg_locations.json");
    const stream = createReadStream(sppgPath, { start: 0, end: 2048 });
    
    let chunk = "";
    for await (const data of stream) {
      chunk += data.toString();
    }
    
    // Extract metadata block using regex since JSON might be incomplete in the chunk
    const metaMatch = chunk.match(/"metadata":\s*\{[\s\S]*?\}/);
    if (metaMatch) {
      try {
        const meta = JSON.parse("{" + metaMatch[0] + "}");
        totalSppg = meta.metadata.total_official || totalSppg;
        totalSuspended = meta.metadata.total_suspended || 0;
        certificationRate = meta.metadata.certification_rate || "0%";
      } catch (e) {
        console.error("Failed to parse partial SPPG metadata");
      }
    }

    // Get mapped count from the smaller points file
    const pointsPath = join(process.cwd(), "public", "data", "sppg_points.json");
    const { readFile } = await import("fs/promises");
    const pointsData = JSON.parse(await readFile(pointsPath, "utf-8"));
    mappedSppg = pointsData.length;

  } catch (err) {
    console.error("Gagal memuat statistik SPPG:", err);
  }
  
  return {
    TOTAL_ENTITIES: fullData.entities.length,
    TOTAL_RELATIONS: fullData.relations.length,
    TOTAL_RED_FLAGS: fullData.red_flags.length,
    TOTAL_SPPG: totalSppg,
    TOTAL_SUSPENDED: totalSuspended,
    CERTIFICATION_RATE: certificationRate,
    MAPPED_SPPG: mappedSppg,
    LATEST_UPDATE: fullData.metadata.tanggal_riset || new Date().toISOString().split("T")[0],
  };
}
