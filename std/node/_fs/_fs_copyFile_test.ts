const { test } = Deno;
import { assertEquals, assertThrows, fail } from "../../testing/asserts.ts";
import { copyFile, copyFileSync } from "./_fs_copyFile.ts";
import { COPYFILE_FICLONE, COPYFILE_FICLONE_FORCE } from "./_fs_constants.ts";

const encoder = new TextEncoder();
const data = encoder.encode("Hello world");

test({
  name: "Invalid flags throw error",
  fn() {
    assertThrows(() => {
      copyFile("some_source.file", "some_dest.file", COPYFILE_FICLONE, 
      () => { fail("Should never be called") });
    }, Error, "Only COPYFILE_EXCL flag is supported");
    assertThrows(() => {
      copyFile("some_source.file", "some_dest.file", COPYFILE_FICLONE_FORCE, 
      () => { fail("Should never be called") });
    }, Error, "Only COPYFILE_EXCL flag is supported");
    assertThrows(() => {
      copyFileSync("some_source.file", "some_dest.file", COPYFILE_FICLONE);
    }, Error, "Only COPYFILE_EXCL flag is supported");
    assertThrows(() => {
      copyFileSync("some_source.file", "some_dest.file", COPYFILE_FICLONE_FORCE);
    }, Error, "Only COPYFILE_EXCL flag is supported");
  }
});

test({
  name: "ASYNC function requires callback to be supplied",
  fn() {
    assertThrows(() => {
      copyFile("some_source.file", "some_dest.file", COPYFILE_FICLONE_FORCE);
    }, Error, "Only COPYFILE_EXCL flag is supported");
  }
});

test({
  name: "ASYNC copy file works",
  async fn() {
    let tmpFile = await Deno.makeTempFile();
    await Deno.writeFile(tmpFile, data);
    new Promise((resolve, reject) => {
      copyFile(tmpFile, tmpFile + "_copy", (err) => {
        if (err) reject(err);
        else resolve();
      });
    }).then(() => {

    }).catch((err) => {
      fail("Expected success but was: " + err);
    }).finally(() => {
      Deno.remove(tmpFile);
    });
  }
});
