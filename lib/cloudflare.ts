import { log } from "./logger";

const CF_API_BASE = "https://api.cloudflare.com/client/v4";

function getConfig() {
    const apiToken = process.env.CF_API_TOKEN || process.env.CF_API_KEY;
    const zoneId = process.env.CF_ZONE_ID;
    const baseUrl = process.env.CF_BASE_URL || "https://sglottoresult.com";
    if (!apiToken || !zoneId) return null;

    const hosts = Array.from(
        new Set(
            (process.env.CF_PURGE_HOSTS || "")
                .split(",")
                .map(h => h.trim())
                .filter(Boolean)
        )
    );

    return {
        apiToken,
        zoneId,
        baseUrl: baseUrl.replace(/\/+$/, ""),
        hosts,
    };
}

function buildUrls(paths: string[]): string[] {
    const cfg = getConfig();
    if (!cfg) return [];
    return Array.from(new Set(paths.map(p => `${cfg.baseUrl}${p.startsWith("/") ? "" : "/"}${p}`)));
}

// Get all URLs that need to be purged for a specific game type
function getGamePurgePaths(gameType: '4D' | 'Toto' | 'Sweep', drawDate?: string): string[] {
    const gameSlug = gameType === '4D' ? '4d' : gameType.toLowerCase();

    const paths: string[] = [
        "/", // Homepage always gets purged
        "/sitemap.xml",
        `/${gameSlug}`,
        `/${gameSlug}/history`,
    ];

    // Add date-based URL if provided
    if (drawDate) {
        paths.push(`/${gameSlug}/${drawDate}`);
    }

    // Add jackpot page for Toto
    if (gameType === 'Toto') {
        paths.push("/jackpot");
    }

    return paths;
}

// Purge cache for specific game after scrape/update
export async function purgeGameCache(gameType: '4D' | 'Toto' | 'Sweep', drawDate?: string): Promise<boolean> {
    const paths = getGamePurgePaths(gameType, drawDate);
    return purgeCloudflarePaths(paths, `${gameType} result update`);
}

// Purge all game caches
export async function purgeAllGameCaches(): Promise<boolean> {
    const paths = [
        "/",
        "/sitemap.xml",
        "/4d",
        "/4d/history",
        "/toto",
        "/toto/history",
        "/sweep",
        "/sweep/history",
        "/jackpot",
        "/schedule",
    ];
    return purgeCloudflarePaths(paths, "All games bulk purge");
}

// Core purge function
export async function purgeCloudflarePaths(paths: string[], reason?: string): Promise<boolean> {
    const cfg = getConfig();
    if (!cfg) {
        log("[Cloudflare] Purge skipped: missing CF config (CF_API_TOKEN or CF_ZONE_ID)", "WARN");
        return false;
    }

    const targets = buildUrls(paths);
    if (targets.length === 0) {
        log("[Cloudflare] No paths to purge", "WARN");
        return false;
    }

    // Determine purge strategy
    const strategy = (process.env.CF_PURGE_STRATEGY || "files").toLowerCase();
    const hostList = cfg.hosts && cfg.hosts.length > 0 ? cfg.hosts : [];
    const effectiveStrategy = strategy === "hosts" && hostList.length === 0 ? "files" : strategy;

    const payload =
        effectiveStrategy === "everything"
            ? { purge_everything: true }
            : effectiveStrategy === "hosts"
                ? { hosts: hostList }
                : { files: targets };

    try {
        log(`[Cloudflare] Purge request: ${reason || 'manual'} | Strategy: ${effectiveStrategy} | URLs: ${targets.length}`, "INFO");

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${cfg.apiToken}`,
        };

        const res = await fetch(`${CF_API_BASE}/zones/${cfg.zoneId}/purge_cache`, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        const text = await res.text();

        if (!res.ok) {
            log(`[Cloudflare] Purge FAILED: ${res.status} | Response: ${text}`, "ERROR");
            return false;
        } else {
            log(`[Cloudflare] Purge SUCCESS: ${targets.join(", ")}`, "INFO");
            return true;
        }
    } catch (err) {
        log(`[Cloudflare] Purge error: ${err instanceof Error ? err.message : String(err)}`, "ERROR");
        return false;
    }
}
