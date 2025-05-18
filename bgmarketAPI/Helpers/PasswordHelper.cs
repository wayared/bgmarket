using Microsoft.AspNetCore.Identity;

namespace bgmarketAPI.Helpers
{
    public static class PasswordHelper
    {
        private static PasswordHasher<string> hasher = new PasswordHasher<string>();

        public static string HashPassword(string password)
        {
            return hasher.HashPassword(null, password);
        }

        public static bool VerifyPassword(string hashedPassword, string providedPassword) {
            var result = hasher.VerifyHashedPassword(null, hashedPassword, providedPassword);
            return result == PasswordVerificationResult.Success;
        }

    }
}
