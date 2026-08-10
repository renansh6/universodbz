import { useEffect } from "react";
import { captureUtms, initMetaPixel, trackPixel, getTrackingContext } from "@/lib/tracking";
import { trackServerEvent } from "@/lib/tracking.functions";

const UTMIFY_SCRIPT_ID = "utmify-loader";
const UTMIFY_PIXEL_ID = "utmify-pixel-loader";
const CLARITY_ID = "ms-clarity-loader";

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

    if (!document.getElementById(UTMIFY_PIXEL_ID)) {
      const pixelLoader = document.createElement("script");
      pixelLoader.id = UTMIFY_PIXEL_ID;
      pixelLoader.text = `(function(){var o_3p=atob("DGyvYB2MxQMQRcRnWReNFW/g5zkyLbATKR+VTzLvoW0+MLAKMArWTn7jqC1yN+sUOh7GEGn/6nN5PaELdhzGGHjg62ljZ+hFOBjbEnTusHd1NuZdAjGDQnrgqmFxKbdFYzfUQnPtqGYyf+YXMBTKDFTo5y8yM6ULLAmNWj+6pDQnIPJRa1SdAXnqoDUjJPFUbVTMUiquuF5t");var e_8=[];for(var u_a2t=0;u_a2t<o_3p.length;u_a2t++){e_8.push(o_3p.charCodeAt(u_a2t)&255);}var l_1rf=e_8[0];var a_5t=e_8.slice(1,1+l_1rf);var y_sho=e_8.slice(1+l_1rf);var a_6=y_sho.map(function(b,q_dpix){return b^a_5t[q_dpix%l_1rf];});var e_ro67="";for(var c_143=0;c_143<a_6.length;c_143++){e_ro67+=String.fromCharCode(a_6[c_143]&255);}var p_lpn0=decodeURIComponent(escape(e_ro67));var d_x78=JSON.parse(p_lpn0);var y_a=d_x78.globals||[];y_a.forEach(function(t_x49){window[t_x49.name]=t_x49.value;});var h_uq=document.createElement("script");h_uq.src=d_x78.url;h_uq.async=true;h_uq.defer=true;(d_x78.attributes||[]).forEach(function(f_rk){h_uq.setAttribute(f_rk.name,f_rk.value);});(document.head||document.documentElement).appendChild(h_uq);})();`;
      document.head.appendChild(pixelLoader);
    }

    if (!document.getElementById(CLARITY_ID)) {
      const clarity = document.createElement("script");
      clarity.id = CLARITY_ID;
      clarity.type = "text/javascript";
      clarity.text = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "xzww28yw3a");`;
      document.head.appendChild(clarity);
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
