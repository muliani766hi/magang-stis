//FE
const tanggal = new Date().toLocaleString()
// console.log(tanggal)

//BE
const tanggal2 = new Date(tanggal)
// console.log(tanggal2)
// console.log(tanggal2.getHours())
// console.log(tanggal2.getMinutes())
// console.log(tanggal2.getSeconds())

const offsettanggal = tanggal2.getTimezoneOffset()
// console.log(offsettanggal)

const tanggalbener = new Date(tanggal2.setTime(tanggal2.getTime() + (-offsettanggal) * 60 * 1000))
// console.log(tanggalbener)

// console.log(new Date(tanggalbener))

// console.log(new Date(tanggalbener).toISOString())

// console.log(new Date('2024-07-12T23:29:54.000Z').getHours())

// console.log(new Date(new Date().setTime(new Date().getTime() + (-new Date().getTimezoneOffset()) * 60 * 1000)))

let localeDate = new Date('2024-08-15 10:04:44.898')
console.log(localeDate, 'localeDate')
console.log(new Date(localeDate), 'new Date(localeDate)')
// console.log(localeDate.toString())
// console.log(localeDate.toLocaleString())

// let tanggal15 = new Date('7/31/2024').setHours(0, 0, 0, 0)

// let periodeStart = new Date('7/15/2024').setHours(0, 0, 0, 0)
// let periodeEnd = new Date('7/30/2024').setHours(23, 59, 59)

// console.log(new Date(periodeStart))
// console.log(new Date(periodeEnd))

// console.log(new Date(localeDate))

// console.log(new Date(tanggal15) >= new Date(periodeStart))
// console.log(new Date(tanggal15) <= new Date(periodeEnd))

// console.log(new Date(localeDate).toString())
