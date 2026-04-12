"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    WufooForm?: new () => {
      initialize: (options: Record<string, unknown>) => void;
      display: () => void;
    };
  }
}

const FORM_ID = "wufoo-pcscv5j18fzzb3";
const SCRIPT_ID = "wufoo-embed-script";

export function WufooSubmitForm() {
  useEffect(() => {
    const mount = document.getElementById(FORM_ID);
    if (!mount) return;

    const setupForm = () => {
      if (!window.WufooForm) return;
      try {
        const form = new window.WufooForm();
        form.initialize({
          userName: "hoodiehut1",
          formHash: "pcscv5j18fzzb3",
          autoResize: true,
          height: "700",
          async: true,
          host: "wufoo.com",
          header: "hide",
          ssl: true,
        });
        form.display();
      } catch {
        // Ignore Wufoo runtime errors to avoid breaking the page.
      }
    };

    const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      setupForm();
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://www.wufoo.com/scripts/embed/form.js";
    script.async = true;
    script.onload = setupForm;
    document.body.appendChild(script);
  }, []);

  return (
    <div id={FORM_ID}>
      <a href="https://hoodiehut1.wufoo.com/forms/pcscv5j18fzzb3">
        Geometry Club submission form
      </a>
      .
    </div>
  );
}
