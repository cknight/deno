// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

import { CallbackWithError } from "./_fs_common.ts";
import { COPYFILE_EXCL } from "./_fs_constants.ts";
import { notImplemented } from "../_utils.ts";

/**
 * TODO: Also accept 'src' and 'dest' parameters as a Node polyfill Buffer or 
 * URL type once these are implemented. See 
 * https://github.com/denoland/deno/issues/3403
 */
export function copyFile(
  src: string,
  dest: string,
  flagsOrCallback: number | CallbackWithError,
  callback?: CallbackWithError
): void {
  let mode = 0;
  
  if (typeof flagsOrCallback === "function") {
    callback = flagsOrCallback;
  } else {
    mode = flagsOrCallback;
  }

  validateMode(mode);

  if (!callback) {
    throw new Error('No callback supplied');
  }

  new Promise(async (resolve, reject) => {
    try {
      //TODO rework with 'createNew' and COPYFILE_EXCL once 
      // https://github.com/denoland/deno/issues/4017 completes
      await Deno.copyFile(src, dest);
      resolve();
    } catch (err) {
      reject(err);
    }
  })
    .then(() => {
      callback!();
    })
    .catch(err => {
      callback!(err);
    });
}

export function copyFileSync(src: string, dest: string, flags = 0): void {
  validateMode(flags);
  Deno.copyFileSync(src, dest);
}

function validateMode(flags: number):void {
  if (flags > COPYFILE_EXCL) {
    // Deno has no equivalent support for COPYFILE_FICLONE or 
    // COPYFILE_FICLONE_FORCE
    notImplemented("Only COPYFILE_EXCL flag is supported");
  }
}
