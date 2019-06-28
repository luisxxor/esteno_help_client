export default function getRole (machineName) {
  const digitador = /^(pcd[0-9]+)$/i
  const estenotipista = /^(pce[0-9]+)$/i
  const traduccion = /^(pctrad[0-9]+)$/i
  const cabina = /^(pccab[0-9]+)$/i
  let role = ''

  if (digitador.test(machineName)) {
    role = 'Digitador'
  } else if (estenotipista.test(machineName)) {
    role = 'Estenotipista'
  } else if (traduccion.test(machineName)) {
    role = 'Traducción'
  } else if (cabina.test(machineName)) {
    role = 'Cabina'
  }

  return role
}
