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

export const formatNoteDate = (date: Date | null): string => {
  if (!date) return ''

  const day = date.getDate()
  const ordinal = getOrdinalSuffix(day)

  const month = date.toLocaleString('default', { month: 'long' })
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 || 12

  return `${day}${ordinal} ${month} ${year}, ${hour12}:${minutes} ${ampm}`
}

const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return 'th'
  switch (day % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}
