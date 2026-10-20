// Frames are an unwrapped phase; only the renderer wraps the final angle.
// Slew the scroll target before the exact critically damped response. Both
// position and velocity remain continuous on wheel jumps and direction changes.
export function createHelmetMotion() {
  return { target: 0, scroll: 0, velocity: 0, idle: 0 };
}
export function advanceHelmetMotion(state, progress, elapsed) {
  // Do not catch up time spent in another tab or outside the section.
  let remaining = Math.min(64, Math.max(0, elapsed));
  while (remaining > 0) {
    const dt = Math.min(8, remaining);
    const distance = Math.max(0, Math.min(1, progress)) * 143 - state.target;
    state.target += Math.max(-.075 * dt, Math.min(.075 * dt, distance));
    const omega = 1 / 105, offset = state.scroll - state.target;
    const c = state.velocity + omega * offset, decay = Math.exp(-omega * dt);
    state.scroll = state.target + (offset + c * dt) * decay;
    state.velocity = (state.velocity - omega * c * dt) * decay;
    state.idle += dt * .012;
    remaining -= dt;
  }
  return state.scroll + state.idle;
}
