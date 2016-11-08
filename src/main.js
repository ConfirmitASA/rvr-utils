/**
 * Created by IvanP on 07.09.2016.
 */

import RVRutils from "./rvr-utils"

window.RVR = window.RVR || {};
RVRutils.mixin(window.RVR,{
  utils: RVRutils
});

export default RVRutils;
