export function batasiKata(teks: string, batas: number): string {
  // Pisahkan teks menjadi array kata-kata
  const kataArray = teks.split(' ')

  // Periksa apakah jumlah kata melebihi batas
  if (kataArray.length > batas) {
    // Gabungkan kembali kata-kata yang dibatasi dan tambahkan "..."
    return kataArray.slice(0, batas).join(' ') + '...'
  }

  // Jika tidak melebihi, kembalikan teks asli
  return teks
}

export function batasiHuruf(teks: string, batas: number): string {
  const chars = Array.from(teks)
  if (chars.length <= batas) return teks

  return chars.slice(0, batas).join('') + '...'
}
