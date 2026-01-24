# Google Drive API Setup Guide

## Krok 1: Vytvoření Google Cloud projektu

1. Přejděte na [Google Cloud Console](https://console.cloud.google.com/)
2. Klikněte na "Select a project" → "New Project"
3. Název projektu: `Elevia 3D Config Tool`
4. Klikněte "Create"

## Krok 2: Povolení Google Drive API

1. V levém menu vyberte "APIs & Services" → "Library"
2. Vyhledejte "Google Drive API"
3. Klikněte na něj a poté "Enable"

## Krok 3: Konfigurace OAuth Consent Screen

1. Přejděte na "APIs & Services" → "OAuth consent screen"
2. Vyberte "External" (pokud nemáte Google Workspace)
3. Vyplňte:
   - App name: `Elevia 3D Config Tool`
   - User support email: váš email
   - Developer contact: váš email
4. Klikněte "Save and Continue"
5. Na stránce "Scopes" přidejte:
   - `https://www.googleapis.com/auth/drive.file`
   - `https://www.googleapis.com/auth/drive.appdata`
6. Pokračujte a dokončete nastavení

## Krok 4: Vytvoření OAuth 2.0 Credentials

1. Přejděte na "APIs & Services" → "Credentials"
2. Klikněte "+ Create Credentials" → "OAuth client ID"
3. Application type: **Web application**
4. Name: `Elevia 3D Tool Web Client`
5. Authorized JavaScript origins:
   ```
   http://localhost:8080
   http://127.0.0.1:8080
   https://your-domain.com (pokud máte)
   ```
6. Authorized redirect URIs:
   ```
   http://localhost:8080
   http://127.0.0.1:8080
   ```
7. Klikněte "Create"
8. **Zkopírujte Client ID** - budete ho potřebovat!

## Krok 5: Vložení Client ID do aplikace

1. Otevřete soubor `js/google-drive-api.js`
2. Najděte řádek s `CLIENT_ID` a vložte váš Client ID:

```javascript
const CLIENT_ID = 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com';
```

## Krok 6: Testování

1. Spusťte lokální server:
   ```bash
   npx http-server -p 8080
   ```
2. Otevřete `http://localhost:8080/spline-configs.html`
3. Klikněte na "Sign in with Google"
4. Autorizujte aplikaci

## Poznámky

- **Development mode**: Aplikace je v "Testing" módu, takže pouze přidaní test uživatelé mohou používat OAuth
- Pro přidání test uživatelů: OAuth consent screen → Test users → Add users
- Pro produkční nasazení budete muset projít verifikací Google

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Zkontrolujte, že URL v prohlížeči přesně odpovídá Authorized JavaScript origins

### Error: "access_denied"
- Přidejte svůj email jako test user v OAuth consent screen

### Soubory se neukládají do správné složky
- Aplikace automaticky vytvoří/najde složku "3D Tool" ve vašem Drive
- Složka bude vytvořena v root adresáři, pokud neexistuje









