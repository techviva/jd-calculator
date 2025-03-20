export function capitalizeFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export function formatDate(date: string | undefined) {
  if (!date) return '-'
  const formattedDate = new Date(date)
  return formattedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
