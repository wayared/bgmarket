using bgmarketDB.Models;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace bgmarketAPI.Helpers
{
    public static class LogHelper
    {
        public static LogSistema CrearLog(HttpContext httpContext, string accion, string entidad, string detalle)
        {
            var userId = httpContext.User.FindFirst("id")?.Value;

            return new LogSistema
            {
                usuarioId = int.Parse(userId ?? "0"),
                accion = accion,
                entidad = entidad,
                detalle = detalle,
                fechaRegistro = DateTime.UtcNow,
                ipOrigen = httpContext.Connection.RemoteIpAddress?.ToString() ?? "desconocida"
            };
        }
    }
}
