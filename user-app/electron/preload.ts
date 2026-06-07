import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  setProxy: (proxyUrl: string) => ipcRenderer.invoke('set-proxy', proxyUrl),
  getProxy: () => ipcRenderer.invoke('get-proxy'),
});
