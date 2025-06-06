interface Config {
  apiBaseUrl: string;
}

let cachedConfig: Config | null = null;

export async function getConfig(): Promise<Config> {
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    const response = await fetch("/config", { credentials: "include" });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch config: ${response.status}`);
    }
    
    cachedConfig = await response.json();
    return cachedConfig!
  } catch (error) {
    console.error("Failed to load configuration:", error);
    // Fallback to current origin if config fails
    cachedConfig = {
      apiBaseUrl: window.location.origin
    };
    return cachedConfig!;
  }
}

export function clearConfigCache() {
  cachedConfig = null;
}