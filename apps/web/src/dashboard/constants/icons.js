export const serviceIcons = {
  walk: 'W',
  groom: 'G',
  hotel: 'H',
  vet: 'V',
  emergency: '!',
  shop: 'S',
};

export function getProviderInitials(name) {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
