import {
  dlopen,
  FFITypes,
  getSharedLibraryExtension,
  opaquePointer,
} from "buster:ffi";
import { getBusterExtPath } from "../../src/common.ts";
import { join } from "node:path";

const busterExtPath = getBusterExtPath();

const webview_t = opaquePointer("webview_t");
const webview_error_t = FFITypes.int32;
const webview_hint_t = FFITypes.int32;

const libWebview = dlopen(
  join(busterExtPath, "webview", "libwebview" + getSharedLibraryExtension()),
  {
    functions: {
      webview_create: {
        returnType: webview_t,
        parameters: [FFITypes.int32, FFITypes.int32],
      },
      webview_run: {
        returnType: webview_error_t,
        parameters: [webview_t],
      },
      webview_set_html: {
        returnType: webview_error_t,
        parameters: [webview_t, FFITypes.string],
      },
      webview_set_size: {
        returnType: webview_error_t,
        parameters: [webview_t, FFITypes.int32, FFITypes.int32, webview_hint_t],
      },
      webview_set_title: {
        returnType: webview_error_t,
        parameters: [webview_t, FFITypes.string],
      },
    },
  } as const,
);

export { libWebview };
