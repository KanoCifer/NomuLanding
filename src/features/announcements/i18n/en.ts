export default {
  announcements: {
    meta: {
      title: 'Announcements',
      description:
        'Feature releases, version changes, maintenance windows and security notices for Nomu, newest first.',
    },
    eyebrow: 'Announcements',
    title: 'Nomu announcements',
    subheadline:
      'New features, version updates, maintenance windows and security notices are posted here, grouped by category with the newest first. The extension overview also surfaces the ones worth acting on.',
    loading: 'Loading announcements…',
    loadFailed: 'Announcements are unavailable right now. Please check back later.',
    empty: 'No announcements yet.',
    // Keys match the backend API `type` values; no separate enum is invented here.
    types: {
      general: 'Notice',
      feature: 'New feature',
      update: 'Update',
      maintenance: 'Maintenance',
      security: 'Security',
      credit: 'Credits',
    },
  },
} as const;
