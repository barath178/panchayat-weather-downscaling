import type { Metadata } from 'next';
import LegalPage, { REPO } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy policy · AeroAgro AI',
  description: 'What AeroAgro AI does and does not collect: no accounts, no cookies, no analytics.',
};

// Keep this page in step with the code: lib/security.ts lists every third party the app contacts.
export default function Privacy() {
  return (
    <LegalPage
      title="Privacy policy"
      intro="AeroAgro AI has no accounts, no cookies, no analytics and no advertising. It runs in your browser and does not send your personal information to us, because there is no server of ours to send it to."
    >
      <h2>What we collect</h2>
      <p>Nothing. The site is a set of static files. It has no login, no forms that submit to us, no tracking scripts and no database of users.</p>

      <h2>Your location</h2>
      <p>
        If you tap <strong>Use my location</strong>, your browser asks for permission first. The position is used inside your browser to pick the nearest of the 303 regions,
        and is then discarded. It is not sent to us or to any weather service. You can refuse or withdraw the permission in your browser settings at any time.
      </p>

      <h2>Voice questions and read-aloud</h2>
      <p>
        The microphone button in <strong>Ask AeroAgro</strong> uses your browser&rsquo;s built-in speech recognition. In some browsers, such as Google Chrome, that feature sends
        the audio to the browser maker&rsquo;s speech service to turn it into text. That is handled by your browser under its own privacy policy; AeroAgro never receives the
        audio. Typed questions are answered entirely on your device. Read-aloud uses the voices installed on your device.
      </p>

      <h2>Services your browser contacts</h2>
      <p>To show the forecast and maps, your browser requests data from these services. They see your IP address, as any website you visit does:</p>
      <ul>
        <li>
          <strong>Open-Meteo</strong> (api.open-meteo.com): forecast and elevation for the region you select. The request contains the region&rsquo;s coordinates, not yours.
        </li>
        <li>
          <strong>Esri</strong> (server.arcgisonline.com): the default dark map tiles.
        </li>
        <li>
          <strong>Google</strong> (mt0 to mt3.google.com): map tiles, only if you switch to the relief, satellite or road basemap.
        </li>
        <li>
          <strong>India Meteorological Department</strong> (mausam.imd.gov.in): satellite images, only when you open the satellite view or overlay.
        </li>
      </ul>
      <p>The site&rsquo;s host (Vercel, or GitHub Pages for the mirror) keeps standard server logs, such as IP address and pages requested, under its own policy.</p>

      <h2>Data stored on your device</h2>
      <p>
        To load faster and make fewer requests, the site caches forecast and elevation data in your browser&rsquo;s session and local storage. This holds weather numbers only, never
        anything about you. Clearing your browser&rsquo;s site data removes it.
      </p>

      <h2>Sharing to WhatsApp</h2>
      <p>
        <strong>Share on WhatsApp</strong> and the QR codes open WhatsApp with the advisory text filled in. Nothing is sent until you press send in WhatsApp, and from then on
        WhatsApp&rsquo;s own privacy policy applies.
      </p>

      <h2>Children</h2>
      <p>The site does not knowingly collect information from anyone, including children.</p>

      <h2>Changes and contact</h2>
      <p>
        If the app starts handling personal data in a new way, this page will be updated first and the date at the top will change. Questions can be raised as an issue on the{' '}
        <a href={`${REPO}/issues`} target="_blank" rel="noopener noreferrer">
          project&rsquo;s GitHub page
        </a>
        .
      </p>
    </LegalPage>
  );
}
