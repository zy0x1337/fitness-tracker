// Kurze, ermutigende Microcopy für den Feier-Moment.
const MESSAGES = [
  'Stark!',
  'Sauber!',
  'Geschafft!',
  'Weiter so!',
  'Top gemacht!',
  'Dranbleiben!',
  'Klasse!',
];

export function randomEncouragement(): string {
  return MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
}
