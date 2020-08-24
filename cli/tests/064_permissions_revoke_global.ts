const status1 = await Deno.permissions.revoke({ name: "read" });
const status2 = await Deno.permissions.query({ name: "read", path: "foo" });
const status3 = await Deno.permissions.query({ name: "read", path: "bar" });
const status4 = await Deno.permissions.revokeSync({ name: "write" });
const status5 = await Deno.permissions.querySync(
  { name: "write", path: "foo" },
);
const status6 = await Deno.permissions.querySync(
  { name: "write", path: "bar" },
);
console.log(status1);
console.log(status2);
console.log(status3);
console.log(status4);
console.log(status5);
console.log(status6);
