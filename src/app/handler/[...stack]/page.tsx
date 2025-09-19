import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "../../../stack";

export default function Handler(props: unknown) {
  if (!stackServerApp) {
    return <div>Stack Auth not configured</div>;
  }

  return <StackHandler fullPage app={stackServerApp} routeProps={props} />;
}
