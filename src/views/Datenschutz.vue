<template>
<div id="datenschutz">
    <h1>Datenschutzerklärung der App Kassensystem</h1>

    <h2>1. Verantwortliche Stelle</h2>
    <p>Diese Datenschutzerklärung gilt für die App Kassensystem, betrieben von Feuerwehr-Server. Sie können uns bei Fragen zum Datenschutz unter feuerwehr.server.pph@gmail.com erreichen.</p>

    <h2>2. Zweck der App</h2>
    <p>Die App dient zur Unterstützung von Feuerwehrkräften bei Einsätzen und in der Einsatzvorbereitung. Sie stellt Informationen auf einer Karte dar, die von autorisierten Benutzern hinzugefügt werden.</p>

    <h2>3. Verarbeitete Daten</h2>
    <h3>3.1 Login-Daten</h3>
    <p>Zur Nutzung des internen Bereichs werden folgende Daten verarbeitet:</p>
    <ul>
        <li>Benutzername</li>
        <li>Passwort</li>
        <li>Vor- und Nachname</li>
    </ul>

    <h3>3.2 Lokale Speicherung</h3>
    <p>Login-Daten werden verschlüsselt lokal auf dem Gerät gespeichert, um eine schnellere Anmeldung zu ermöglichen.</p>

    <h3>3.3 Nutzergenerierte Inhalte</h3>
    <p>Von autorisierten Benutzern hinzugefügte Inhalte, wie Karteninformationen, werden lokal verarbeitet und nicht automatisch erfasst.</p>

    <h3>3.4 Datenaufbewahrung und Löschung</h3>
    <p>Die erhobenen Login-Daten werden nur so lange gespeichert, wie dies zur Bereitstellung der App-Funktionen erforderlich ist. Nach Abmeldung oder Löschung eines Benutzerkontos werden die Login-Daten vollständig gelöscht.</p>

    <h3>3.5 Technische Daten</h3>
    <p>Beim Zugriff auf die App können folgende technische Daten verarbeitet werden:</p>
    <ul>
        <li>IP-Adresse</li>
        <li>Gerätetyp und Betriebssystem</li>
        <li>Zeitpunkt des Zugriffs</li>
    </ul>

    <h2>4. Datenweitergabe</h2>
    <p>Es erfolgt keine Weitergabe Ihrer personenbezogenen Daten an Dritte. Wir verwenden keine Drittanbieter-Dienste, die Zugriff auf personenbezogene Daten haben.</p>

    <h2>5. Datensicherheit</h2>
    <p>Wir setzen technische und organisatorische Maßnahmen ein, um Ihre personenbezogenen Daten zu schützen, darunter Verschlüsselung und Zugriffsbeschränkungen.</p>

    <h2>6. Ihre Rechte</h2>
    <ul>
        <li><strong>Recht auf Auskunft:</strong> Sie können jederzeit Auskunft über Ihre Daten verlangen.</li>
        <li><strong>Recht auf Berichtigung:</strong> Beantragen Sie die Berichtigung unrichtiger Daten.</li>
        <li><strong>Recht auf Löschung:</strong> Fordern Sie die Löschung Ihrer Daten.</li>
        <li><strong>Recht auf Widerspruch:</strong> Widersprechen Sie der Verarbeitung Ihrer Daten.</li>
        <li><strong>Recht auf Datenübertragbarkeit:</strong> Erhalten Sie Ihre Daten in einem übertragbaren Format.</li>
    </ul>

    <h2>7. Änderungen der Datenschutzerklärung</h2>
    <p>Wir behalten uns das Recht vor, diese Datenschutzerklärung bei Bedarf zu aktualisieren.</p>

    <h2>8. Kontakt</h2>
    <p>Bei Fragen oder Anliegen zum Datenschutz erreichen Sie uns unter feuerwehr.server.pph@gmail.com</p>

    <p><strong>Stand:</strong> 15.12.2024</p>

</div>
</template>

<style lang="scss">
#datenschutz{
    color: black;
    background-color: white;
    padding-bottom: 5rem;
    height: 100vh;
    overflow-y: scroll;

    #homeButton{
        position: fixed;
        //bottom: -2.7rem;
        bottom: 1.5rem;
        left: 50%;
        transform: translateX(-50%);
    }

    .mapButton{
        width: 3.5rem;
        height: 3.5rem;
        box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.11);
        background-color: white;
        z-index: 400;
        border: none;
        border-radius: 90px;
        transition: transform 0.3s ease;

        img{
            height: 60%;
            margin: auto;
        }
    }
}
</style>