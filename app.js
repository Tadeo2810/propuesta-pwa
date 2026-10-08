const estadoRed = document.getElementById('estado-red');
const estadoNotificacion = document.getElementById('estado-notificacion');
const btnNotificacion = document.getElementById('btn-notificacion');

// Registro de Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('Service Worker registrado:', reg.scope))
      .catch((err) => {
        console.error('Error en Service Worker:', err);
        estadoRed.textContent = 'No se pudo preparar el modo sin conexión.';
      });
  });
} else {
  estadoRed.textContent = 'Este navegador no admite el modo sin conexión de la PWA.';
}

// Control de Estado Offline/Online
function actualizarEstadoRed() {
  if (navigator.onLine) {
    estadoRed.textContent = 'Estado: Con conexión';
    estadoRed.style.color = 'green';
  } else {
    estadoRed.textContent = 'Estado: Sin conexión; se usará el contenido guardado.';
    estadoRed.style.color = 'red';
  }
}

window.addEventListener('online', actualizarEstadoRed);
window.addEventListener('offline', actualizarEstadoRed);
actualizarEstadoRed();

// Mostrar una notificación local en este dispositivo
btnNotificacion.addEventListener('click', async () => {
  if (!('Notification' in window)) {
    estadoNotificacion.textContent = 'Este navegador no admite notificaciones.';
    return;
  }

  if (!('serviceWorker' in navigator)) {
    estadoNotificacion.textContent = 'Este navegador no admite notificaciones de la PWA.';
    return;
  }

  btnNotificacion.disabled = true;
  estadoNotificacion.textContent = 'Solicitando permiso para mostrar la notificación...';

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification('¡Notificación PWA!', {
        body: 'Las notificaciones funcionan correctamente en este dispositivo.',
        icon: new URL('./icons/icon-192x192.png', registration.scope).href
      });
      estadoNotificacion.textContent = 'Notificación mostrada en este dispositivo.';
    } else {
      estadoNotificacion.textContent = 'No se concedió permiso para las notificaciones.';
    }
  } catch (error) {
    console.error('Error al mostrar la notificación:', error);
    estadoNotificacion.textContent = 'No se pudo mostrar la notificación.';
  } finally {
    btnNotificacion.disabled = false;
  }
});