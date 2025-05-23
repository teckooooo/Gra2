@component('mail::message')
# 📩 Reporte Automático

Hola **{{ $user->name }}**,

Adjunto encontrarás el reporte automático correspondiente a la fecha **{{ now()->format('d/m/Y H:i') }}**.

@component('mail::panel')
Este correo ha sido generado y enviado automáticamente por el sistema de reportes.
@endcomponent

Si tienes dudas o necesitas más información, por favor comunícate con el área correspondiente.

Gracias,  
**Equipo de Monitoreo**  
CableColor
@endcomponent
