import { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { PAGE_DEFAULTS, type PageId } from '../scripts/seedFirestore';

export function useSiteContent(pageId: PageId) {
  const defaults = PAGE_DEFAULTS[pageId] ?? {};
  const [data, setData] = useState<any>(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DataService.getSiteContent(pageId).then(remote => {
      if (!remote || Object.keys(remote).length === 0) {
        setData(defaults);
      } else {
        // Merge per section: remote fields override defaults, but keep default for empty strings
        const merged: any = {};
        const allSections = new Set([...Object.keys(defaults), ...Object.keys(remote)]);
        allSections.forEach(sec => {
          const def = defaults[sec] ?? {};
          const rem = (remote[sec] ?? {}) as any;
          merged[sec] = { ...def };
          for (const [k, v] of Object.entries(rem)) {
            // Preserve remote value unless it's an empty string and default is non-empty
            if (typeof v === 'string' && v === '' && def[k]) {
              merged[sec][k] = def[k];
            } else {
              merged[sec][k] = v;
            }
          }
        });
        setData(merged);
      }
      setLoading(false);
    });
  }, [pageId]);

  // Shorthand getters
  const g = (section: string, field: string): string =>
    data?.[section]?.[field] ?? defaults?.[section]?.[field] ?? '';

  const visible = (section: string): boolean =>
    data?.[section]?.visivel !== false;

  const arr = <T,>(section: string, field: string): T[] =>
    data?.[section]?.[field] ?? defaults?.[section]?.[field] ?? [];

  return { data, loading, g, visible, arr };
}
