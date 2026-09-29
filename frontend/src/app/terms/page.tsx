import type { Metadata } from 'next';
import LegalPage, { REPO } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Terms of use · AeroAgro AI',
  description: 'Terms for using AeroAgro AI: a free decision-support tool, not an official IMD forecast.',
};

export default function Terms() {
  return (
    <LegalPage
      title="Terms of use"
      intro="AeroAgro AI is a free tool that estimates village-level weather and turns it into farm advice. By using the site you agree to these terms. If you do not agree, please do not use it."
    >
      <h2>1. What the service is</h2>
      <p>
        AeroAgro takes public forecasts on 11 to 25 km grids and estimates values for 1.2 km cells using elevation and terrain physics. It then applies agronomy rules to suggest
        spray windows, irrigation and crop-protection steps. It is free, needs no account and may change or stop at any time.
      </p>

      <h2>2. Not an official forecast</h2>
      <p>
        Downscaled values are <strong>estimates for decision support</strong>. They are not forecasts, warnings or advisories issued by the India Meteorological Department (IMD),
        the Ministry of Earth Sciences, ICAR or any government body. For severe-weather warnings, always follow IMD and your local authorities.
      </p>
      <ul>
        <li>&ldquo;Live today&rdquo; uses real forecasts from Open-Meteo when they can be fetched.</li>
        <li>When they cannot, and in the Monsoon, Winter frost and Pre-monsoon modes, the numbers are seasonal averages or simulations, and the site labels them that way.</li>
      </ul>

      <h2>3. Farm decisions are yours</h2>
      <p>
        Spray, irrigation, fertiliser and pest suggestions are general guidance based on weather rules. Read and follow the label of any pesticide or fertiliser, and check with your
        local Krishi Vigyan Kendra or agriculture officer before acting on advice that affects your crop or livestock.
      </p>

      <h2>4. Crop insurance evidence</h2>
      <p>
        The PMFBY report compares weather against index triggers and adds a SHA-256 checksum so the numbers can be checked later. It is supporting evidence only. It is not a claim,
        an assessment or a decision by any insurer or by the Pradhan Mantri Fasal Bima Yojana, and it does not guarantee any payout.
      </p>

      <h2>5. Data from other providers</h2>
      <p>
        Forecast and elevation data come from Open-Meteo and the Copernicus DEM, map tiles from Esri and Google, and satellite images from IMD. Each is provided under its own
        terms, which apply to your use of that data. We are not responsible for their accuracy or availability.
      </p>

      <h2>6. Acceptable use</h2>
      <ul>
        <li>Do not use automated tools to send large numbers of requests through the site. This can get the free data services blocked for everyone.</li>
        <li>Do not present the site&rsquo;s output as an official government forecast or insurance decision.</li>
        <li>Do not try to break, overload or misuse the site.</li>
      </ul>

      <h2>7. No warranty</h2>
      <p>
        The service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without any warranty of accuracy, completeness or fitness for a particular purpose. Weather is
        uncertain and the estimates can be wrong.
      </p>

      <h2>8. Limitation of liability</h2>
      <p>
        To the extent the law allows, the makers of AeroAgro AI are not liable for crop loss, financial loss or any other damage arising from use of, or inability to use, the site
        or its advice.
      </p>

      <h2>9. Source code</h2>
      <p>
        The source code is published on{' '}
        <a href={REPO} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        . Reuse of the code is governed by the licence in that repository, if any, not by these terms.
      </p>

      <h2>10. Changes and contact</h2>
      <p>
        These terms may be updated; the date at the top shows the latest version. Questions can be raised as an issue on the{' '}
        <a href={`${REPO}/issues`} target="_blank" rel="noopener noreferrer">
          project&rsquo;s GitHub page
        </a>
        .
      </p>
    </LegalPage>
  );
}
