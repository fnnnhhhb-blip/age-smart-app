/// <reference types="vite/client" />

interface ElectronAPI {
  setProxy: (proxyUrl: string) => Promise<{ success: boolean; proxy: string | null }>;
  getProxy: () => Promise<string>;
}

interface Window {
  electronAPI?: ElectronAPI;
}
