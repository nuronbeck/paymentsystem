using Microsoft.IdentityModel.Tokens;
using System.Text;
namespace PaymentSystem
{
    class AuthOptions
    {
        public const string ISSUER = "authserver";
        public const string AUDIENCE = "authclient";
        const string KEY = "secrettokensupertoeknt!1123";
        public const int LIFETIME = 1;
        public static SymmetricSecurityKey GetSymmetricSecurityKey()
        {
            return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(KEY));
        }
    }
}