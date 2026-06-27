document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".mainnav-toggle");
  const sidebar = document.getElementById("mainnav-container");
  const scrollTop = document.querySelector(".scroll-top");

  toggle?.addEventListener("click", (e) => {
    e.preventDefault();
    sidebar?.classList.toggle("open");
  });

  scrollTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Live clock
  const clock = document.getElementById("server-clock");
  if (clock) {
    const tick = () => {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      clock.textContent = `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    };
    tick();
    setInterval(tick, 1000);
  }
});
