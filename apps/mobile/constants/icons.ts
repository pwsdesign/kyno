// Service icon labels — rendered as styled monograms in containers, no emoji.
export const serviceIcons: Record<string, string> = {
  walk: 'W',
  groom: 'G',
  hotel: 'H',
  vet: 'V',
  emergency: '!',
  shop: 'S',
};

export function getProviderInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
